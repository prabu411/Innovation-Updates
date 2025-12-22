import React from 'react';
import { Download, FileText } from 'lucide-react';

const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || 'http://localhost:5003';

const DocumentCenter = ({ documents }) => {
  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">OD & Document Center</h2>
      <div className="space-y-3">
        {documents.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No documents available.</p>
        ) : (
          documents.map(doc => {
            const title = doc.title || doc.name || 'Document';
            const updatedAt = doc.createdAt || doc.updatedAt || null;
            const filePath = doc.filePath || doc.path || '';
            const downloadUrl = filePath ? `${API_ORIGIN}/${filePath}` : '#';

            return (
              <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-400" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-gray-400">{updatedAt ? `Updated: ${new Date(updatedAt).toLocaleDateString()}` : ''}</p>
                  </div>
                </div>
                {filePath ? (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                  >
                    <Download size={14} /> Download
                  </a>
                ) : (
                  <button disabled className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-xs rounded opacity-60">
                    <Download size={14} /> Not available
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DocumentCenter;
