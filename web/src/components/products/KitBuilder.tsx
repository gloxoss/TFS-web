/**
 * Kit Builder Components
 * 
 * Components for configuring Smart Kits with customizable slots.
 * Supports "Swap" (single-select) and "Add More" (multi-select) interactions.
 * 
 * Uses unified types from @/types/commerce
 */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Plus, ChevronRight } from 'lucide-react'
import { Product } from '@/services/products/types'
import { ResolvedKit, ResolvedKitSlot } from '@/types/commerce'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface KitSelections {
  [slotName: string]: string[] // Array of selected product IDs per slot
}

export interface KitBuilderProps {
  resolvedKit: ResolvedKit
  initialSelections?: KitSelections
  onChange?: (selections: KitSelections) => void
  lng?: string
  className?: string
}

export interface KitSlotRowProps {
  slot: ResolvedKitSlot
  selectedIds: string[]
  onEdit: () => void
  lng?: string
}

export interface KitSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  slot: ResolvedKitSlot
  selectedIds: string[]
  onConfirm: (selectedIds: string[]) => void
  lng?: string
}

// ============================================================================
// Kit Selection Modal
// ============================================================================

export function KitSelectionModal({
  isOpen,
  onClose,
  slot,
  selectedIds,
  onConfirm,
  lng = 'en',
}: KitSelectionModalProps) {
  const [localSelection, setLocalSelection] = useState<string[]>(selectedIds)

  // Reset local selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelection(selectedIds)
    }
  }, [isOpen, selectedIds])

  const handleToggleItem = (itemId: string) => {
    if (slot.allowMultiple) {
      // Multi-select: toggle item
      setLocalSelection((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      // Single-select: replace selection
      setLocalSelection([itemId])
    }
  }

  const handleConfirm = () => {
    onConfirm(localSelection)
    onClose()
  }

  const isSelected = (itemId: string) => localSelection.includes(itemId)
  const isDefault = (itemId: string) => slot.defaultItems.some(i => i.product_id === itemId)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[80vh] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {lng === 'fr' ? 'Configurer' : 'Configure'} {slot.slotName}
                </h3>
                <p className="text-sm text-zinc-400">
                  {slot.allowMultiple
                    ? lng === 'fr'
                      ? 'Sélectionnez autant que vous le souhaitez'
                      : 'Select as many as you need'
                    : lng === 'fr'
                    ? 'Choisissez une option'
                    : 'Choose one option'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {slot.availableOptions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-3 rounded-lg border transition-all',
                    isSelected(item.id)
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                  )}
                >
                  {/* Selection indicator */}
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      isSelected(item.id)
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-zinc-600'
                    )}
                  >
                    {isSelected(item.id) && <Check className="w-3 h-3 text-black" />}
                  </div>

                  {/* Item thumbnail */}
                  <div className="w-12 h-12 rounded bg-zinc-700 flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                        IMG
                      </div>
                    )}
                  </div>

                  {/* Item info */}
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">{item.name}</p>
                    {isDefault(item.id) && (
                      <span className="text-xs text-amber-400">
                        {lng === 'fr' ? 'Inclus par défaut' : 'Included by default'}
                      </span>
                    )}
                  </div>

                  {/* BLIND QUOTE: No prices shown */}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                {lng === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
              >
                {lng === 'fr' ? 'Confirmer' : 'Confirm'} ({localSelection.length})
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// Kit Slot Row
// ============================================================================

export function KitSlotRow({ slot, selectedIds, onEdit, lng = 'en' }: KitSlotRowProps) {
  const selectedItems = slot.availableOptions.filter((item) =>
    selectedIds.includes(item.id)
  )

  return (
    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
      <div className="flex-1">
        <h4 className="font-medium text-white">{slot.slotName}</h4>
        <div className="mt-1 flex flex-wrap gap-1">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-zinc-700 text-zinc-300"
              >
                {item.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-zinc-500">
              {lng === 'fr' ? 'Aucune sélection' : 'No selection'}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onEdit}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
      >
        {slot.allowMultiple ? (
          <>
            <Plus className="w-4 h-4" />
            {lng === 'fr' ? 'Ajouter' : 'Add More'}
          </>
        ) : (
          <>
            <ChevronRight className="w-4 h-4" />
            {lng === 'fr' ? 'Modifier' : 'Edit'}
          </>
        )}
      </button>
    </div>
  )
}

// ============================================================================
// Kit Builder (Main Component)
// ============================================================================

export function KitBuilder({
  resolvedKit,
  initialSelections,
  onChange,
  lng = 'en',
  className,
}: KitBuilderProps) {
  // Initialize selections from defaults if not provided
  const [selections, setSelections] = useState<KitSelections>(() => {
    if (initialSelections) return initialSelections

    const defaults: KitSelections = {}
    for (const slot of resolvedKit.slots) {
      defaults[slot.slotName] = slot.defaultItems.map(i => i.product_id)
    }
    return defaults
  })

  const [activeSlotName, setActiveSlotName] = useState<string | null>(null)

  const activeSlot = resolvedKit.slots.find(
    (s) => s.slotName === activeSlotName
  )

  const handleSlotConfirm = (slotName: string, selectedIds: string[]) => {
    const newSelections = { ...selections, [slotName]: selectedIds }
    setSelections(newSelections)
    onChange?.(newSelections)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {lng === 'fr' ? 'Configurer votre kit' : 'Configure Your Kit'}
        </h3>
      </div>

      <div className="space-y-3">
        {resolvedKit.slots.map((slot) => (
          <KitSlotRow
            key={slot.slotName}
            slot={slot}
            selectedIds={selections[slot.slotName] || []}
            onEdit={() => setActiveSlotName(slot.slotName)}
            lng={lng}
          />
        ))}
      </div>

      {/* Selection Modal */}
      {activeSlot && (
        <KitSelectionModal
          isOpen={!!activeSlotName}
          onClose={() => setActiveSlotName(null)}
          slot={activeSlot}
          selectedIds={selections[activeSlot.slotName] || []}
          onConfirm={(ids) => handleSlotConfirm(activeSlot.slotName, ids)}
          lng={lng}
        />
      )}
    </div>
  )
}

export default KitBuilder
