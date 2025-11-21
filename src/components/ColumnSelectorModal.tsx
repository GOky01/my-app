import { useState } from 'react'
import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './ColumnSelectorModal.css'

interface Column {
  key: string
  label: string
}

interface ColumnSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (selectedColumns: string[]) => void
  allColumns: Column[]
  selectedColumns: string[]
}

function DroppablePanel({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`columns-panel ${isOver ? 'drag-over' : ''}`}
      style={{ backgroundColor: isOver ? '#e0f2fe' : 'transparent' }}
    >
      {children}
    </div>
  )
}

function DraggableColumnItem({
  column,
  isSelected,
  onRemove,
}: {
  column: Column
  isSelected: boolean
  onRemove?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.key,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onRemove) {
      onRemove()
    }
  }

  const handleRemoveMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.remove-btn')) {
      return
    }
    const pointerDownHandler = listeners?.onPointerDown as ((e: React.PointerEvent) => void) | undefined
    if (pointerDownHandler) {
      pointerDownHandler(e)
    }
  }

  const dragHandlers = isSelected && onRemove
    ? {
        ...listeners,
        onPointerDown: handlePointerDown,
      }
    : listeners

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...dragHandlers}
      className={`column-item ${isSelected ? 'selected' : 'available'}`}
    >
      <span>{column.label}</span>
      {isSelected && onRemove && (
        <button
          type="button"
          onClick={handleRemoveClick}
          onMouseDown={handleRemoveMouseDown}
          onPointerDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          className="remove-btn"
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default function ColumnSelectorModal({
  isOpen,
  onClose,
  onApply,
  allColumns,
  selectedColumns: initialSelectedColumns,
}: ColumnSelectorModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(initialSelectedColumns)
  const [searchTerm, setSearchTerm] = useState('')

  if (!isOpen) return null

  const availableColumns = allColumns.filter(
    (col) => !selectedColumns.includes(col.key) && col.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedColumnsData = allColumns.filter((col) => selectedColumns.includes(col.key))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const draggedKey = active.id as string
    const overKey = over.id as string

    const isDraggedSelected = selectedColumns.includes(draggedKey)

    if (overKey === 'selected-columns') {
      if (!isDraggedSelected) {
        setSelectedColumns([...selectedColumns, draggedKey])
      }
      return
    }

    if (overKey === 'available-columns') {
      if (isDraggedSelected) {
        setSelectedColumns(selectedColumns.filter((key) => key !== draggedKey))
      }
      return
    }

    const isOverSelected = selectedColumns.includes(overKey)

    if (!isDraggedSelected && isOverSelected) {
      const overIndex = selectedColumns.indexOf(overKey)
      const newSelected = [...selectedColumns]
      newSelected.splice(overIndex, 0, draggedKey)
      setSelectedColumns(newSelected)
    } else if (isDraggedSelected && isOverSelected) {
      const oldIndex = selectedColumns.indexOf(draggedKey)
      const newIndex = selectedColumns.indexOf(overKey)
      if (oldIndex !== newIndex) {
        const newSelected = [...selectedColumns]
        newSelected.splice(oldIndex, 1)
        newSelected.splice(newIndex, 0, draggedKey)
        setSelectedColumns(newSelected)
      }
    }
  }

  const handleRemove = (columnKey: string) => {
    setSelectedColumns(selectedColumns.filter((key) => key !== columnKey))
  }

  const handleApply = () => {
    onApply(selectedColumns)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select columns for the grid</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <DroppablePanel id="available-columns">
              <div className="panel-header">Available Columns</div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="columns-list">
                <SortableContext items={availableColumns.map((col) => col.key)} strategy={verticalListSortingStrategy}>
                  {availableColumns.map((col) => (
                    <DraggableColumnItem key={col.key} column={col} isSelected={false} />
                  ))}
                </SortableContext>
                {availableColumns.length === 0 && (
                  <div className="empty-state">
                    {searchTerm ? 'No columns found' : 'All columns are selected'}
                  </div>
                )}
              </div>
            </DroppablePanel>

            <DroppablePanel id="selected-columns">
              <div className="panel-header">Selected Columns</div>
              <div className="columns-list">
                <SortableContext items={selectedColumns} strategy={verticalListSortingStrategy}>
                  {selectedColumnsData.map((col) => (
                    <DraggableColumnItem
                      key={col.key}
                      column={col}
                      isSelected={true}
                      onRemove={() => handleRemove(col.key)}
                    />
                  ))}
                </SortableContext>
                {selectedColumns.length === 0 && (
                  <div className="empty-state">Drag columns here or drop from available columns</div>
                )}
              </div>
            </DroppablePanel>
          </DndContext>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleApply} className="apply-btn">
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

