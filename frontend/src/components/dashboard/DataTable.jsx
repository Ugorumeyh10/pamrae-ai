import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function DataTable({ data = [], columns = [], itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const tableStyle = {
    borderColor: 'var(--border)',
  }

  const headerStyle = {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border)',
  }

  const cellStyle = {
    color: 'var(--text-primary)',
    borderColor: 'var(--border)',
  }

  const hoverStyle = {
    backgroundColor: 'var(--hover)',
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={tableStyle}>
        <thead>
          <tr style={headerStyle}>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                No data available
              </td>
            </tr>
          ) : (
            currentData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b transition-colors"
                style={cellStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm border-b">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                borderColor: 'var(--border)',
                color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-primary)'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) e.target.style.backgroundColor = 'var(--hover)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      currentPage === pageNum ? 'font-semibold' : ''
                    }`}
                    style={{
                      backgroundColor: currentPage === pageNum ? 'var(--text-primary)' : 'transparent',
                      color: currentPage === pageNum ? 'var(--bg-primary)' : 'var(--text-primary)',
                      border: currentPage === pageNum ? 'none' : `1px solid var(--border)`,
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== pageNum) e.target.style.backgroundColor = 'var(--hover)'
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== pageNum) e.target.style.backgroundColor = 'transparent'
                    }}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                borderColor: 'var(--border)',
                color: currentPage === totalPages ? 'var(--text-secondary)' : 'var(--text-primary)'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) e.target.style.backgroundColor = 'var(--hover)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable

