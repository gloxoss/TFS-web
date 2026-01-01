/**
 * Quote Request Page
 * 
 * Multi-step form for submitting a rental quote request.
 * Uses react-hook-form + zod for validation.
 * 
 * Refactored to use sub-components for each step.
 */
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react'

import { useCartStore, useAuthStore } from '@/stores'
import {
  quoteFormSchema,
  QuoteFormData,
} from '@/lib/schemas/quote'
import { submitQuote } from '@/lib/actions/quote'
import { QuoteResult } from '@/services'
import { cn } from '@/lib/utils'
import { DateRange } from '@/components/ui/date-range-picker'
import { quotePage, t } from '@/data/site-content'

// Sub-components
import { QuoteDatesStep } from '@/components/quote/quote-dates-step'
import { QuoteContactStep } from '@/components/quote/quote-contact-step'
import { QuoteProjectStep } from '@/components/quote/quote-project-step'
import { QuoteReviewStep } from '@/components/quote/quote-review-step'
import { QuoteSuccessView } from '@/components/quote/quote-success-view'

type FormStep = 'dates' | 'contact' | 'project' | 'review'

// Helper to get translated step labels
const getSteps = (lng: string): { id: FormStep; label: string }[] => [
  { id: 'dates', label: t(quotePage.steps.dates, lng) },
  { id: 'contact', label: t(quotePage.steps.contact, lng) },
  { id: 'project', label: t(quotePage.steps.project, lng) },
  { id: 'review', label: t(quotePage.steps.review, lng) },
]

export default function QuotePage() {
  const params = useParams()
  const router = useRouter()
  // Ensure lng is a string
  const lng = Array.isArray(params?.lng) ? params.lng[0] : (params?.lng as string) || 'en'

  const [currentStep, setCurrentStep] = useState<FormStep>('dates')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<QuoteResult | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const [existingAccountEmail, setExistingAccountEmail] = useState<string | null>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)

  // Cast items to any to bypass strict store type mismatch for now, or map them properly
  // Store has dates as strings, components recognize them
  const items = useCartStore((state) => state.items)
  const globalDates = useCartStore((state) => state.globalDates)
  const setGlobalDates = useCartStore((state) => state.setGlobalDates)
  const clearCart = useCartStore((state) => state.clearCart)

  const user = useAuthStore((state) => state.user)

  // Helper: Split user name into first/last
  const splitName = useMemo(() => {
    if (!user?.name) return { firstName: '', lastName: '' }
    const parts = user.name.trim().split(/\s+/)
    if (parts.length === 1) return { firstName: parts[0], lastName: '' }
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' '),
    }
  }, [user])

  // Local date state for the form (synced with cart store)
  // Store dates are strings, so we use string-based DateRange
  const [rentalDates, setRentalDates] = useState<DateRange | null>(
    globalDates ? { start: globalDates.start, end: globalDates.end } : null
  )

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      firstName: splitName.firstName,
      lastName: splitName.lastName,
      email: user?.email || '',
      phone: '',
      company: '',
      projectType: undefined,
      projectDescription: '',
      notes: '',
      location: '',
      deliveryPreference: undefined,
      acceptTerms: false,
    },
    mode: 'onChange',
  })

  // Debounced email check
  const checkEmailExistsHandler = useCallback(async (email: string) => {
    if (!email || user) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setExistingAccountEmail(null)
      return
    }
    setCheckingEmail(true)
    try {
      const { checkEmailExists } = await import('@/lib/actions/check-email')
      const exists = await checkEmailExists(email)
      setExistingAccountEmail(exists ? email : null)
    } catch {
      setExistingAccountEmail(null)
    } finally {
      setCheckingEmail(false)
    }
  }, [user])

  const watchedEmail = form.watch('email')
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkEmailExistsHandler(watchedEmail)
    }, 800)
    return () => clearTimeout(timeoutId)
  }, [watchedEmail, checkEmailExistsHandler])

  const { trigger, getValues, watch } = form

  // Redirect if empty
  if (items.length === 0 && !submitResult?.success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-zinc-400 mb-6">Add some equipment to request a quote.</p>
          <Link
            href={`/${lng}/equipment`}
            className="px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Browse Equipment
          </Link>
        </div>
      </div>
    )
  }

  // Success View
  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden py-12">
        <QuoteSuccessView
          result={submitResult}
          lng={lng}
          items={items as any}
          rentalDates={rentalDates}
        />
      </div>
    )
  }

  const handleDateSelect = (range: DateRange | null | undefined) => {
    setRentalDates(range ?? null)
  }

  const handleNext = async () => {
    if (currentStep === 'dates') {
      if (!rentalDates || !rentalDates.start || !rentalDates.end) {
        setDateError('Please select your rental dates')
        return
      }
      setDateError(null)
      // Save back to store as strings
      setGlobalDates({
        start: rentalDates.start,
        end: rentalDates.end
      })
      setCurrentStep('contact')
    } else if (currentStep === 'contact') {
      const valid = await trigger(['firstName', 'lastName', 'email', 'phone', 'company'])
      if (valid) setCurrentStep('project')
    } else if (currentStep === 'project') {
      const valid = await trigger(['projectType', 'projectDescription', 'deliveryPreference', 'notes'])
      if (valid) setCurrentStep('review')
    }
  }

  const handleBack = () => {
    if (currentStep === 'contact') setCurrentStep('dates')
    else if (currentStep === 'project') setCurrentStep('contact')
    else if (currentStep === 'review') setCurrentStep('project')
  }

  const handleSubmit = async () => {
    const valid = await trigger('acceptTerms')
    if (!valid) return

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const formData = getValues()
      const result = await submitQuote({
        formData,
        guestCartItems: items.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name || item.product.nameEn || item.product.slug,
            slug: item.product.slug,
            imageUrl: item.product.imageUrl,
          },
          quantity: item.quantity,
          dates: item.dates, // Already correct shape
          groupId: item.groupId,
          kitTemplateId: item.kitTemplateId,
          kitSelections: item.kitSelections,
          selectedVariants: item.selectedVariants,
        })),
        globalDates: globalDates,
        lng,
      })

      if (result.success) {
        const data = result.data
        setSubmitResult(result)
        clearCart()
      } else {
        setSubmitResult(result)
      }
    } catch {
      setSubmitResult({
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get translated steps
  const steps = getSteps(lng)
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/${lng}/cart`}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(quotePage.navigation.backToCart, lng)}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white">{t(quotePage.title, lng)}</h1>
        <p className="text-zinc-400 mt-2">
          {t(quotePage.subtitle, lng)}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              <div
                className={cn(
                  'w-full h-1 rounded-full transition-colors',
                  index <= currentStepIndex ? 'bg-white' : 'bg-zinc-800'
                )}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={cn(
                'text-sm',
                index <= currentStepIndex ? 'text-white' : 'text-zinc-600'
              )}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8">
          <FormProvider {...form}>
            <AnimatePresence mode="wait">
              {currentStep === 'dates' && (
                <QuoteDatesStep
                  key="step-dates"
                  rentalDates={rentalDates}
                  onSelect={handleDateSelect}
                  items={items.map(i => ({
                    id: i.id,
                    product: {
                      name: i.product.name,
                      nameEn: i.product.nameEn,
                      slug: i.product.slug,
                      imageUrl: i.product.imageUrl,
                    },
                    quantity: i.quantity
                  }))}
                  lng={lng}
                />
              )}
              {currentStep === 'contact' && (
                <QuoteContactStep
                  key="step-contact"
                  existingAccountEmail={existingAccountEmail}
                  lng={lng}
                />
              )}
              {currentStep === 'project' && <QuoteProjectStep key="step-project" lng={lng} />}
              {currentStep === 'review' && (
                <QuoteReviewStep
                  key="step-review"
                  items={items}
                  rentalDates={rentalDates || undefined}
                  submitResult={submitResult}
                  lng={lng}
                />
              )}
            </AnimatePresence>
          </FormProvider>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800">
            {currentStep !== 'dates' ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t(quotePage.navigation.back, lng)}
              </button>
            ) : (
              <Link
                href={`/${lng}/cart`}
                className="px-6 py-2.5 text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t(quotePage.navigation.backToCart, lng)}
              </Link>
            )}

            {currentStep !== 'review' ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                {t(quotePage.navigation.continue, lng)}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !watch('acceptTerms')}
                className={cn(
                  'px-6 py-2.5 font-semibold rounded-lg flex items-center gap-2 transition-colors',
                  isSubmitting || !watch('acceptTerms')
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                    : 'bg-white text-zinc-900 hover:bg-zinc-200'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t(quotePage.navigation.submitting, lng)}
                  </>
                ) : (
                  <>
                    {t(quotePage.navigation.submit, lng)}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
