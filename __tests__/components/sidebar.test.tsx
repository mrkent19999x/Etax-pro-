import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from '@/components/sidebar'

// Mock useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('Sidebar Component', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'Test User'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })
  })

  it('renders sidebar when open', () => {
    render(<Sidebar isOpen={true} onClose={() => {}} />)

    expect(screen.getByText('Xin chào Test User')).toBeInTheDocument()
    expect(screen.getByText('Trang chủ')).toBeInTheDocument()
    expect(screen.getByText('Hóa đơn điện tử')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<Sidebar isOpen={false} onClose={() => {}} />)

    expect(screen.queryByText('Xin chào Test User')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn()
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)

    const closeButton = screen.getByRole('button', { name: /×/i })
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('navigates to home when Trang chủ is clicked', () => {
    render(<Sidebar isOpen={true} onClose={() => {}} />)

    const homeButton = screen.getByText('Trang chủ')
    fireEvent.click(homeButton)

    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('navigates to hoa-don-dien-tu when Hóa đơn điện tử is clicked', () => {
    render(<Sidebar isOpen={true} onClose={() => {}} />)

    const invoiceButton = screen.getByText('Hóa đơn điện tử')
    fireEvent.click(invoiceButton)

    expect(mockPush).toHaveBeenCalledWith('/hoa-don-dien-tu')
  })

  it('handles logout correctly', () => {
    const mockOnClose = jest.fn()
    render(<Sidebar isOpen={true} onClose={mockOnClose} />)

    const logoutButton = screen.getByText('Đăng xuất')
    fireEvent.click(logoutButton)

    expect(localStorage.removeItem).toHaveBeenCalledWith('isLoggedIn')
    expect(localStorage.removeItem).toHaveBeenCalledWith('userMST')
    expect(localStorage.removeItem).toHaveBeenCalledWith('userName')
    expect(mockPush).toHaveBeenCalledWith('/login')
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
