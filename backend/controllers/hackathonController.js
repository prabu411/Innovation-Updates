const Hackathon = require('../models/Hackathon');
const Application = require('../models/Application');

exports.createHackathon = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);

    const { dates, themes, eligibleDepartments, ...restOfBody } = req.body;
    const hackathonData = { ...restOfBody };

    // Safely parse dates
    try {
      hackathonData.dates = dates ? JSON.parse(dates) : [];
    } catch (e) {
      return res.status(400).json({ message: 'Invalid format for dates. Expected a JSON array string.' });
    }

    // Safely parse themes
    try {
      hackathonData.themes = themes ? JSON.parse(themes) : [];
    } catch (e) {
      return res.status(400).json({ message: 'Invalid format for themes. Expected a JSON array string.' });
    }

    // Safely parse eligible departments
    try {
      hackathonData.eligibleDepartments = eligibleDepartments ? JSON.parse(eligibleDepartments) : [];
    } catch (e) {
      // Allow comma-separated fallback
      hackathonData.eligibleDepartments = eligibleDepartments ? String(eligibleDepartments).split(',').map(s => s.trim()).filter(Boolean) : [];
    }

    if (req.file) {
      hackathonData.poster = req.file.path;
    }
    
    hackathonData.createdBy = req.user.id;

    console.log("Attempting to create hackathon with data:", hackathonData);

    const hackathon = await Hackathon.create(hackathonData);
    res.status(201).json(hackathon);
  } catch (error) {
    console.error("Create Hackathon Error:", error);
    res.status(500).json({ message: `Server error during hackathon creation: ${error.message}` });
  }
};

exports.getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find().populate('createdBy', 'name email').sort('-createdAt');
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).populate('createdBy', 'name email');
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHackathon = async (req, res) => {
  try {
    const { dates, themes, eligibleDepartments, ...restOfBody } = req.body;
    const updateData = { ...restOfBody };

    if (dates) {
      try {
        updateData.dates = JSON.parse(dates);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid format for dates.' });
      }
    }
    if (themes) {
      try {
        updateData.themes = JSON.parse(themes);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid format for themes.' });
      }
    }
    if (eligibleDepartments) {
      try {
        updateData.eligibleDepartments = JSON.parse(eligibleDepartments);
      } catch (e) {
        updateData.eligibleDepartments = String(eligibleDepartments).split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (req.file) {
      updateData.poster = req.file.path;
    }

    const hackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    res.json(hackathon);
  } catch (error) {
    console.error("Update Hackathon Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    await Application.deleteMany({ hackathon: req.params.id });
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getParticipatedStudents = async (req, res) => {
  try {
    const { hackathonId, mode, startDate, endDate } = req.query;
    
    let query = {};
    if (hackathonId) query.hackathon = hackathonId;

    const applications = await Application.find(query)
      .populate({
        path: 'student',
        select: 'name email rollNumber department year'
      })
      .populate({
        path: 'hackathon',
        select: 'name dates mode'
      });

    let filteredApplications = applications;

    if (mode) {
      filteredApplications = filteredApplications.filter(app => app.hackathon.mode === mode);
    }

    if (startDate || endDate) {
      filteredApplications = filteredApplications.filter(app => {
        const eventDate = new Date(app.hackathon.dates[0]);
        if (startDate && endDate) {
          return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
        } else if (startDate) {
          return eventDate >= new Date(startDate);
        } else {
          return eventDate <= new Date(endDate);
        }
      });
    }

    res.json(filteredApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New: Combined participants (applications + registrations) with filters for coordinator view
exports.getParticipants = async (req, res) => {
  try {
    const { hackathonId, department, year, status } = req.query;

    // Fetch applications (internal applications)
    let appQuery = {};
    if (hackathonId) appQuery.hackathon = hackathonId;

    const applications = await Application.find(appQuery)
      .populate({ path: 'student', select: 'name email rollNumber department year' })
      .populate({ path: 'hackathon', select: 'name dates mode' });

    // Fetch registrations (external registration links)
    const Registration = require('../models/registrationModel');
    let regQuery = {};
    if (hackathonId) regQuery.hackathon = hackathonId;

    const registrations = await Registration.find(regQuery)
      .populate({ path: 'user', select: 'name email rollNumber department year' })
      .populate({ path: 'hackathon', select: 'name dates mode' });

    // Map to unified records
    const mapped = [];

    registrations.forEach(r => {
      if (!r.user) return;
      mapped.push({
        _id: r._id,
        studentId: r.user._id,
        name: r.user.name,
        rollNumber: r.user.rollNumber,
        department: r.user.department,
        year: r.user.year,
        hackathon: r.hackathon,
        status: 'registered',
        createdAt: r.registrationDate || r.createdAt
      });
    });

    applications.forEach(a => {
      if (!a.student) return;
      // prefer application record over registration for same student+hackathon
      const key = `${a.student._id}_${a.hackathon._id}`;
      const existingIndex = mapped.findIndex(m => `${m.studentId}_${m.hackathon?._id}` === key);
      const rec = {
        _id: a._id,
        studentId: a.student._id,
        name: a.student.name,
        rollNumber: a.student.rollNumber,
        department: a.student.department,
        year: a.student.year,
        hackathon: a.hackathon,
        status: a.status || 'applied',
        createdAt: a.createdAt
      };
      if (existingIndex > -1) {
        // overwrite registration with application
        mapped[existingIndex] = rec;
      } else {
        mapped.push(rec);
      }
    });

    // Apply department/year/status filtering
    let result = mapped;
    if (department) result = result.filter(r => r.department && r.department.toLowerCase() === String(department).toLowerCase());
    if (year) result = result.filter(r => String(r.year) === String(year));
    if (status && status !== 'all') result = result.filter(r => r.status === status);

    // Sort by createdAt desc
    result.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
