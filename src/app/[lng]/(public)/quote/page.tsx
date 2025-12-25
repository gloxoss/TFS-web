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

import { useState, useEffect, useCallback, useMemo } from 'react'
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
  Calendar,
  LogIn,
} from 'lucide-react'
import PocketBase from 'pocketbase'
import { useTranslation } from '@/app/i18n/client'

import { useCartStore, useAuthStore } from '@/stores'
import {
  quoteFormSchema,
  QuoteFormData,
  projectTypeLabels,
  deliveryPreferenceLabels
} from '@/lib/schemas/quote'
import { submitQuote } from '@/lib/actions/quote'
import { cn } from '@/lib/utils'
import { DateRangePicker, DateRange, formatDateRange, calculateRentalDays } from '@/components/ui/date-range-picker'

type FormStep = 'dates' | 'contact' | 'project' | 'review'

const steps: { id: FormStep; label: string }[] = [
  { id: 'dates', label: 'Rental Dates' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'project', label: 'Project Details' },
  { id: 'review', label: 'Review & Submit' },
]

export default function QuotePage() {
  const params = useParams()
  const router = useRouter()
  const lng = (params?.lng as string) || 'en'
  const { t } = useTranslation(lng, 'quote')

  const [currentStep, setCurrentStep] = useState<FormStep>('dates')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    confirmationNumber?: string
    quoteId?: string
    accessToken?: string
    error?: string
  } | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const [existingAccountEmail, setExistingAccountEmail] = useState<string | null>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)

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
  const [rentalDates, setRentalDates] = useState<DateRange | null>(
    globalDates ? { start: globalDates.start, end: globalDates.end } : null
  )

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      // Auto-fill from logged-in user
      firstName: splitName.firstName,
      lastName: splitName.lastName,
      email: user?.email || '',
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

  // Debounced email check for existing accounts (guests only)
  const checkEmailExistsHandler = useCallback(async (email: string) => {
    if (!email || user) return // Skip if logged in or no email

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setExistingAccountEmail(null)
      return
    }

    setCheckingEmail(true)
    try {
      // Use server action to check email (avoids API permission issues)
      const { checkEmailExists } = await import('@/lib/actions/check-email')
      const exists = await checkEmailExists(email)
      setExistingAccountEmail(exists ? email : null)
    } catch {
      // Silently fail - don't block user
      setExistingAccountEmail(null)
    } finally {
      setCheckingEmail(false)
    }
  }, [user])

  // Watch email field for changes (debounced)
  const watchedEmail = form.watch('email')
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkEmailExistsHandler(watchedEmail)
    }, 800) // 800ms debounce

    return () => clearTimeout(timeoutId)
  }, [watchedEmail, checkEmailExistsHandler])

  const { register, formState: { errors, isValid }, trigger, getValues, watch } = form

  // BLIND QUOTE: No pricing calculated client-side
  // Just count items for display
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Redirect if cart is empty (only on initial load)
  if (items.length === 0 && !submitResult?.success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{t('empty.title')}</h1>
          <p className="text-zinc-400 mb-6">{t('empty.subtitle')}</p>
          <Link
            href={`/${lng}/equipment`}
            className="px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            {t('empty.action')}
          </Link>
        </div>
      </div>
    )
  }

  // Success state - Enhanced cinema-grade design
  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg w-full text-center relative z-10"
        >
          {/* Success Icon with animated ring */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative w-24 h-24 mb-8 mx-auto"
          >
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-900/50 to-green-950/50 border border-green-600/50 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t('success.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 mb-8 max-w-md mx-auto"
          >
            {t('success.message')}
          </motion.p>

          {/* Confirmation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6 mb-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-zinc-400">{t('success.confirmationLabel')}</span>
            </div>
            <p className="text-2xl md:text-3xl font-mono font-bold text-white tracking-wider">
              {submitResult.confirmationNumber}
            </p>
          </motion.div>

          {/* Magic Link - Track Your Quote */}
          {submitResult.quoteId && submitResult.accessToken && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-5 mb-8"
            >
              <div className="flex items-start gap-3 text-left">
                <FileText className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-purple-300 font-medium mb-2">
                    {t('magicLink.title')}
                  </p>
                  <p className="text-sm text-zinc-400 mb-3">
                    {t('magicLink.subtitle')}
                  </p>
                  <Link
                    href={`/${lng}/quote/${submitResult.quoteId}?token=${submitResult.accessToken}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-colors text-sm font-medium"
                  >
                    {t('magicLink.action')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Confirmation Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-950/30 border border-blue-800/30 rounded-xl p-5 mb-8"
          >
            <div className="flex items-start gap-3 text-left">
              <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-300 font-medium mb-1">
                  {t('emailNotice.title')}
                </p>
                <p className="text-sm text-zinc-400">
                  {t('emailNotice.subtitle')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-left mb-8"
          >
            <h3 className="text-sm font-medium text-zinc-300 mb-4 text-center">
              {t('success.nextSteps.title')}
            </h3>
            <div className="space-y-3">
              {[
                { step: '1', text: t('success.nextSteps.step1') },
                { step: '2', text: t('success.nextSteps.step2') },
                { step: '3', text: t('success.nextSteps.step3') },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-lg p-3"
                >
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-zinc-400">{item.step}</span>
                  </div>
                  <span className="text-sm text-zinc-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href={`/${lng}/equipment`}
              className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              {t('success.continue')}
            </Link>
            <Link
              href={`/${lng}`}
              className="px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 transition-colors inline-flex items-center justify-center gap-2"
            >
              {t('success.home')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const handleNext = async () => {
    if (currentStep === 'dates') {
      // Validate dates are selected
      if (!rentalDates || !rentalDates.start || !rentalDates.end) {
        setDateError('Please select your rental dates')
        return
      }
      setDateError(null)
      // Save to cart store
      setGlobalDates(rentalDates)
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
    // Validate terms
    const valid = await trigger('acceptTerms')
    if (!valid) return

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const formData = getValues()

      // BLIND QUOTE: No pricing sent - only product references
      // Always pass cart items from local store (DB cart sync can be added later)
      const result = await submitQuote({
        formData,
        guestCartItems: items.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            // Use name with fallback to nameEn (for bilingual support)
            name: item.product.name || item.product.nameEn || item.product.slug,
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
        // Extract data from create response using type guards
        const data = result.data
        const quoteId = data && 'quoteId' in data ? data.quoteId : data?.id
        const accessToken = data && 'accessToken' in data ? data.accessToken : undefined
        const confirmationNumber = data && 'confirmationNumber' in data ? data.confirmationNumber : undefined

        setSubmitResult({
          success: true,
          confirmationNumber,
          quoteId,
          accessToken,
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
          {t('navigation.backToCart')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white">{t('title')}</h1>
        <p className="text-zinc-400 mt-2">
          {t('description')}
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
              {t(`steps.${step.id}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* Dates Step */}
            {currentStep === 'dates' && (
              <motion.div
                key="dates"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-zinc-400" />
                  {t('dates.title')}
                </h2>

                <p className="text-zinc-400 text-sm">
                  {t('dates.subtitle')}
                </p>

                <DateRangePicker
                  value={rentalDates}
                  onChange={setRentalDates}
                  error={dateError || undefined}
                />

                {/* Equipment Summary */}
                <div className="bg-zinc-800/50 rounded-lg p-4 mt-6">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">
                    {t('dates.summary', { count: items.length })}
                  </h3>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {items.slice(0, 5).map((item) => (
                      <li key={item.id} className="flex items-center gap-3 text-sm">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name || item.product.nameEn || item.product.slug}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-700"
                          />
                        )}
                        <span className="text-zinc-300 flex-1">{item.product.name || item.product.nameEn || item.product.slug}</span>
                        <span className="text-zinc-500">×{item.quantity}</span>
                      </li>
                    ))}
                    {items.length > 5 && (
                      <li className="text-sm text-zinc-500 italic">
                        +{items.length - 5} more items...
                      </li>
                    )}
                  </ul>
                </div>
              </motion.div>
            )}

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
                  {t('contact.title')}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      {t('contact.firstName')}
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      className={cn(
                        'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                        'focus:outline-none focus:ring-2 focus:ring-white/20',
                        errors.firstName ? 'border-red-500' : 'border-zinc-700'
                      )}
                      placeholder={t('contact.firstNamePlaceholder')}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-400 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      {t('contact.lastName')}
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      className={cn(
                        'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                        'focus:outline-none focus:ring-2 focus:ring-white/20',
                        errors.lastName ? 'border-red-500' : 'border-zinc-700'
                      )}
                      placeholder={t('contact.lastNamePlaceholder')}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-400 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <Mail className="w-4 h-4 inline mr-1.5" />
                    {t('contact.email')}
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20',
                      errors.email ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder={t('contact.emailPlaceholder')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                  )}

                  {/* Smart Login Nudge - Shows when guest uses registered email */}
                  {existingAccountEmail && !user && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 bg-blue-950/40 border border-blue-800/40 rounded-lg p-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <LogIn className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-blue-300 font-medium">
                            You have an account!
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Log in to track this quote in your dashboard.
                          </p>
                        </div>
                        <Link
                          href={`/${lng}/login?redirect=/${lng}/quote`}
                          className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-md hover:bg-blue-500/20 transition-colors whitespace-nowrap"
                        >
                          Log In
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <Phone className="w-4 h-4 inline mr-1.5" />
                    {t('contact.phone')}
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20',
                      errors.phone ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder={t('contact.phonePlaceholder')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-400 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <Building className="w-4 h-4 inline mr-1.5" />
                    {t('contact.company')}
                  </label>
                  <input
                    {...register('company')}
                    type="text"
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20',
                      errors.company ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder={t('contact.companyPlaceholder')}
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
                  {t('project.title')}
                </h2>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t('project.type.label')}
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
                    {t('project.description.label')}
                  </label>
                  <textarea
                    {...register('projectDescription')}
                    rows={3}
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20 resize-none',
                      errors.projectDescription ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder={t('project.description.placeholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <Truck className="w-4 h-4 inline mr-1.5" />
                    {t('project.delivery.label')}
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
                    {t('project.notes.label')}
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className={cn(
                      'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                      'focus:outline-none focus:ring-2 focus:ring-white/20 resize-none',
                      errors.notes ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder={t('project.notes.placeholder')}
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

                {/* Rental Period Summary */}
                <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Rental Period
                  </h3>
                  <p className="text-white font-medium">
                    {rentalDates ? formatDateRange(rentalDates) : 'Not selected'}
                  </p>
                  <p className="text-amber-300/70 text-sm">
                    {rentalDates ? `${calculateRentalDays(rentalDates)} day${calculateRentalDays(rentalDates) !== 1 ? 's' : ''} rental` : ''}
                  </p>
                </div>

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
                          {item.product.name || item.product.nameEn || item.product.slug} × {item.quantity}
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
            {currentStep !== 'dates' ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <Link
                href={`/${lng}/cart`}
                className="px-6 py-2.5 text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Link>
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
