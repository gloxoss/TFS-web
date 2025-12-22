import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '../pagination'

describe('Pagination Component', () => {
    it('renders correct page numbers', () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={() => { }}
            />
        )

        expect(screen.getByText('1')).toBeDefined()
        expect(screen.getByText('2')).toBeDefined()
        expect(screen.getByText('3')).toBeDefined()
        expect(screen.getByText('4')).toBeDefined()
        expect(screen.getByText('5')).toBeDefined()
    })

    it('calls onPageChange when a page is clicked', () => {
        const handleChange = vi.fn()
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={handleChange}
            />
        )

        fireEvent.click(screen.getByText('2'))
        expect(handleChange).toHaveBeenCalledWith(2)
    })

    it('disables Previous button on first page', () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={() => { }}
            />
        )

        const prevButton = screen.getByLabelText('Previous page')
        expect(prevButton).toBeDisabled()
    })

    it('disables Next button on last page', () => {
        render(
            <Pagination
                currentPage={5}
                totalPages={5}
                onPageChange={() => { }}
            />
        )

        const nextButton = screen.getByLabelText('Next page')
        expect(nextButton).toBeDisabled()
    })
})
