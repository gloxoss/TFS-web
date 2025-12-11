/**
 * Quote Request Page
 * 
 * Multi-step form for submitting a rental quote request.
 * Uses react-hook-form + zod for validation.
 * 
 * BLIND QUOTE MODE:
 * - NO prices shown or calculated client-side
 * - Admin will calculate and provide pricing
 * 
 * Design Archetype: Dark Cinema
 */
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Building,
  Film,
  FileText,
  Truck,
  MessageSquare,
} from 'lucide-react'

import { useCartStore } from '@/stores'
import { 
  quoteFormSchema, 
  QuoteFormData, 
  projectTypeLabels, 
  deliveryPreferenceLabels 
} from '@/lib/schemas/quote'
import { submitQuote } from '@/lib/actions/quote'
import { cn } from '@/lib/utils'

type FormStep = 'contact' | 'project' | 'review'

const steps: { id: FormStep; label: string }[] = [
  { id: 'contact', label: 'Contact Info' },
  { id: 'project', label: 'Project Details' },
  { id: 'review', label: 'Review & Submit' },
]

export default function QuotePage() {
  const params = useParams()
  const router = useRouter()
  const lng = (params?.lng as string) || 'en'

  const [currentStep, setCurrentStep] = useState<FormStep>('contact')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    confirmationNumber?: string
    error?: string
  } | null>(null)

  const items = useCartStore((state) => state.items)
  const globalDates = useCartStore((state) => state.globalDates)
  const clearCart = useCartStore((state) => state.clearCart)

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      projectType: undefined,
      projectDescription: '',
      notes: '',
      deliveryPreference: undefined,
      acceptTerms: false,
    },
    mode: 'onChange',
  })

  const { register, formState: { errors, isValid }, trigger, getValues, watch } = form

  // BLIND QUOTE: No pricing calculated client-side
  // Just count items for display
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Redirect if cart is empty (only on initial load)
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

  // Success state
  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mb-6 mx-auto rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Quote Request Submitted!</h1>
          <p className="text-zinc-400 mb-6">
            Thank you for your interest. We&apos;ll review your request and contact you within 24 hours.
          </p>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-zinc-500 mb-1">Confirmation Number</p>
            <p className="text-xl font-mono text-white">{submitResult.confirmationNumber}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${lng}/equipment`}
              className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Continue Browsing
            </Link>
            <Link
              href={`/${lng}`}
              className="px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const handleNext = async () => {
    if (currentStep === 'contact') {
      const valid = await trigger(['firstName', 'lastName', 'email', 'phone', 'company'])
      if (valid) setCurrentStep('project')
    } else if (currentStep === 'project') {
      const valid = await trigger(['projectType', 'projectDescription', 'deliveryPreference', 'notes'])
      if (valid) setCurrentStep('review')
    }
  }

  const handleBack = () => {
    if (currentStep === 'project') setCurrentStep('contact')
    else if (currentStep === 'review') setCurrentStep('project')
  }

  const handleSubmit = async () => {
    // Validate terms
    const valid = await trigger('acceptTerms')
    if (!valid) return

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const formData = getValues()
      
      // BLIND QUOTE: No pricing sent - only product references
      const result = await submitQuote({
        formData,
        items: items.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            imageUrl: item.product.imageUrl,
          },
          quantity: item.quantity,
          dates: item.dates,
          groupId: item.groupId,
          kitTemplateId: item.kitTemplateId,
          kitSelections: item.kitSelections,
        })),
        globalDates: globalDates,
        lng,
      })

      if (result.success) {
        setSubmitResult({
          success: true,
          confirmationNumber: result.data?.confirmationNumber,
        })
        clearCart()
      } else {
        setSubmitResult({
          success: false,
          error: result.error,
        })
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
          Back to Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white">Request a Quote</h1>
        <p className="text-zinc-400 mt-2">
          Complete the form below and we&apos;ll get back to you with pricing and availability.
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
          <AnimatePresence mode="wait">
            {/* Contact Step */}
            {currentStep === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-zinc-400" />
                  Contact Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      First Name *
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      className={cn(
                        'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                        'focus:outline-none focus:ring-2 focus:ring-white/20',
                        errors.firstName ? 'border-red-500' : 'border-zinc-700'
                      )}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-400 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      className={cn(
                        'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                        'focus:outline-none focus:ring-2 focus:ring-white/20',
                        errors.lastName ? 'border-red-500' : 'border-zinc-700'
                      )}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-400 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <Mail className="w-4 h-4 inline mr-1.5" />
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20',
                      errors.email ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder="john@production.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <Phone className="w-4 h-4 inline mr-1.5" />
                    Phone Number *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20',
                      errors.phone ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-400 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <Building className="w-4 h-4 inline mr-1.5" />
                    Company (Optional)
                  </label>
                  <input
                    {...register('company')}
                    type="text"
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20',
                      errors.company ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder="Acme Productions"
                  />
                </div>
              </motion.div>
            )}

            {/* Project Step */}
            {currentStep === 'project' && (
              <motion.div
                key="project"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-zinc-400" />
                  Project Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Project Type *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(projectTypeLabels).map(([value, label]) => (
                      <label
                        key={value}
                        className={cn(
                          'flex items-center justify-center px-4 py-2.5 border rounded-lg cursor-pointer transition-colors',
                          watch('projectType') === value
                            ? 'bg-white text-zinc-900 border-white'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                        )}
                      >
                        <input
                          {...register('projectType')}
                          type="radio"
                          value={value}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.projectType && (
                    <p className="text-sm text-red-400 mt-2">{errors.projectType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <FileText className="w-4 h-4 inline mr-1.5" />
                    Project Description (Optional)
                  </label>
                  <textarea
                    {...register('projectDescription')}
                    rows={3}
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20 resize-none',
                      errors.projectDescription ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder="Brief description of your project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <Truck className="w-4 h-4 inline mr-1.5" />
                    Pickup / Delivery *
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {Object.entries(deliveryPreferenceLabels).map(([value, label]) => (
                      <label
                        key={value}
                        className={cn(
                          'flex items-center px-4 py-3 border rounded-lg cursor-pointer transition-colors',
                          watch('deliveryPreference') === value
                            ? 'bg-white text-zinc-900 border-white'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                        )}
                      >
                        <input
                          {...register('deliveryPreference')}
                          type="radio"
                          value={value}
                          className="sr-only"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.deliveryPreference && (
                    <p className="text-sm text-red-400 mt-2">{errors.deliveryPreference.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <MessageSquare className="w-4 h-4 inline mr-1.5" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20 resize-none',
                      errors.notes ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder="Any special requirements or questions..."
                  />
                </div>
              </motion.div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-zinc-400" />
                  Review Your Request
                </h2>

                {/* Contact Summary */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">Contact</h3>
                  <p className="text-white">
                    {watch('firstName')} {watch('lastName')}
                  </p>
                  <p className="text-zinc-300 text-sm">{watch('email')}</p>
                  <p className="text-zinc-300 text-sm">{watch('phone')}</p>
                  {watch('company') && (
                    <p className="text-zinc-400 text-sm">{watch('company')}</p>
                  )}
                </div>

                {/* Project Summary */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">Project</h3>
                  <p className="text-white">
                    {projectTypeLabels[watch('projectType') as keyof typeof projectTypeLabels]}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    {deliveryPreferenceLabels[watch('deliveryPreference') as keyof typeof deliveryPreferenceLabels]}
                  </p>
                  {watch('projectDescription') && (
                    <p className="text-zinc-300 text-sm mt-2">{watch('projectDescription')}</p>
                  )}
                </div>

                {/* Items Summary - BLIND QUOTE: No prices shown */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">
                    Equipment ({items.length} items)
                  </h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span className="text-zinc-300">
                          {item.product.name} × {item.quantity}
                        </span>
                        {item.kitSelections && Object.keys(item.kitSelections).length > 0 && (
                          <span className="text-xs text-amber-400">Kit</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-zinc-700 mt-3 pt-3">
                    <p className="text-sm text-zinc-400 text-center italic">
                      Pricing will be provided in your personalized quote
                    </p>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    {...register('acceptTerms')}
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-white focus:ring-white/20"
                  />
                  <span className="text-sm text-zinc-300">
                    I understand this is a quote request, not a confirmed reservation. 
                    Final pricing and availability will be confirmed by the TFS team.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-400">{errors.acceptTerms.message}</p>
                )}

                {/* Error Message */}
                {submitResult?.error && (
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
                    {submitResult.error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800">
            {currentStep !== 'contact' ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep !== 'review' ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                Continue
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
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quote Request
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
