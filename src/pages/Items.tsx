import { useEffect, useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setItems, setVisibleColumns, setSearchTerm, setSortColumn, reorderColumns, Item } from '../store/slices/itemsSlice'
import ColumnSelectorModal from '../components/ColumnSelectorModal'
import './Items.css'

const allColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'status', label: 'Status' },
]

function SortableColumnHeader({ columnKey, label, onSort }: { columnKey: string; label: string; onSort: (column: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: columnKey })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <th ref={setNodeRef} style={style} {...attributes} {...listeners} className="sortable-header">
      <div className="header-content">
        <span>{label}</span>
        <button onClick={() => onSort(columnKey)} className="sort-btn">
          ↕
        </button>
      </div>
    </th>
  )
}

export default function Items() {
  const dispatch = useAppDispatch()
  const { items, visibleColumns, searchTerm, sortColumn, sortDirection } = useAppSelector((state) => state.items)
  const { token } = useAppSelector((state) => state.auth)
  const [showColumnSelector, setShowColumnSelector] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/items', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        dispatch(setItems(data))
      }
    } catch (err) {
      console.error('Failed to fetch items:', err)
    }
  }

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value))
  }

  const handleSort = (column: string) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    dispatch(setSortColumn({ column, direction }))
  }

  const handleApplyColumns = (newSelectedColumns: string[]) => {
    dispatch(setVisibleColumns(newSelectedColumns))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = visibleColumns.indexOf(active.id as string)
      const newIndex = visibleColumns.indexOf(over.id as string)
      const newColumns = arrayMove(visibleColumns, oldIndex, newIndex)
      dispatch(reorderColumns(newColumns))
    }
  }

  const filteredAndSortedItems = items
    .filter((item) => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return (
        item.id.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.status.toLowerCase().includes(search) ||
        item.createdAt.toLowerCase().includes(search) ||
        item.updatedAt.toLowerCase().includes(search)
      )
    })
    .sort((a, b) => {
      if (!sortColumn) return 0
      const aValue = a[sortColumn as keyof Item]
      const bValue = b[sortColumn as keyof Item]
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const visibleColumnConfigs = visibleColumns
    .map((key) => allColumns.find((col) => col.key === key))
    .filter((col): col is { key: string; label: string } => col !== undefined)

  return (
    <div className="items-page">
      <div className="items-header">
        <h1>Items</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setShowColumnSelector(!showColumnSelector)} className="columns-btn">
            Select Columns
          </button>
        </div>
      </div>

      <ColumnSelectorModal
        key={showColumnSelector ? 'open' : 'closed'}
        isOpen={showColumnSelector}
        onClose={() => setShowColumnSelector(false)}
        onApply={handleApplyColumns}
        allColumns={allColumns}
        selectedColumns={visibleColumns}
      />

      <div className="table-container">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="items-table">
            <thead>
              <tr>
                <SortableContext items={visibleColumns} strategy={horizontalListSortingStrategy}>
                  {visibleColumnConfigs.map((col) => (
                    <SortableColumnHeader key={col.key} columnKey={col.key} label={col.label} onSort={handleSort} />
                  ))}
                </SortableContext>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedItems.map((item) => (
                <tr key={item.id}>
                  {visibleColumns.map((columnKey) => {
                    switch (columnKey) {
                      case 'id':
                        return <td key={columnKey}>{item.id}</td>
                      case 'name':
                        return <td key={columnKey}>{item.name}</td>
                      case 'description':
                        return <td key={columnKey}>{item.description}</td>
                      case 'createdAt':
                        return <td key={columnKey}>{new Date(item.createdAt).toLocaleString()}</td>
                      case 'updatedAt':
                        return <td key={columnKey}>{new Date(item.updatedAt).toLocaleString()}</td>
                      case 'status':
                        return <td key={columnKey}>{item.status}</td>
                      default:
                        return null
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </DndContext>
      </div>
    </div>
  )
}

