# 🍕 Ari's Cafe - Food Delivery Website

A fully responsive, modern food delivery website built with React.js featuring a vibrant design, smooth animations, and comprehensive functionality.

## ✨ Features

### 🏠 **Home Page**

- **Hero Section**: Eye-catching banner with call-to-action
- **Featured Restaurants**: Showcase of top-rated restaurants with badges and discounts
- **Food Categories**: Interactive menu exploration with filtering
- **Popular Dishes**: Grid display of trending food items
- **Customer Testimonials**: Rotating testimonials with ratings
- **App Download Section**: Mobile app promotion with mockup
- **Footer**: Comprehensive links, newsletter signup, and contact info

### 🛒 **Cart Functionality**

- **Add/Remove Items**: Intuitive quantity controls
- **Price Calculations**: Real-time subtotal, delivery fee, and total
- **Promo Codes**: Working discount system (SAVE10, WELCOME20, FIRST15, STUDENT5)
- **LocalStorage Persistence**: Cart data saved across sessions
- **Empty State**: Elegant empty cart with call-to-action
- **Responsive Design**: Mobile-optimized cart interface

### 🔐 **Authentication**

- **Sign Up**: Complete registration with validation
- **Sign In**: User login with error handling
- **Form Validation**: Client-side validation with error states
- **Popup Modal**: Quick login/signup without page navigation
- **Responsive Forms**: Mobile-friendly authentication

### 📦 **Checkout Process**

- **Order Summary**: Detailed breakdown of items and costs
- **Address Form**: Delivery address collection
- **Payment Methods**: Multiple payment options
- **Order Confirmation**: Success screen with order details

## 🎨 **Design Features**

### **Visual Design**

- **Vibrant Color Scheme**: Multi-color gradient themes
- **Custom Animations**: Smooth transitions and hover effects
- **Glassmorphism**: Modern blur effects and transparency
- **Responsive Typography**: Scalable fonts across devices

### **Interactive Elements**

- **Hover States**: Engaging micro-interactions
- **Loading States**: Smooth loading animations
- **Focus States**: Keyboard navigation support
- **Toast Notifications**: Real-time feedback system

### **Accessibility**

- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Reduced Motion**: Respects user preferences

## 🛠️ **Technical Stack**

- **Frontend**: React.js 18+ with Hooks
- **Routing**: React Router DOM
- **Styling**: Custom CSS with CSS Grid & Flexbox
- **State Management**: Context API
- **Icons & Images**: Asset-based system
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 **Project Structure**

```
frontend/
├── public/
├── src/
│   ├── assets/           # Images, icons, and static files
│   ├── components/       # Reusable UI components
│   │   ├── Navbar/       # Navigation component
│   │   ├── Footer/       # Footer component
│   │   ├── Header/       # Hero section
│   │   ├── ExploreMenu/  # Category menu
│   │   ├── FoodDisplay/  # Food items grid
│   │   ├── FeaturedRestaurants/ # Restaurant cards
│   │   ├── Testimonials/ # Customer reviews
│   │   ├── AppDownload/  # Mobile app section
│   │   ├── LoginPopup/   # Authentication modal
│   │   └── Toast/        # Notification system
│   ├── pages/            # Page components
│   │   ├── Home/         # Landing page
│   │   ├── Cart/         # Shopping cart
│   │   ├── PlaceOrder/   # Checkout process
│   │   └── Auth/         # Sign in/up pages
│   ├── context/          # React Context providers
│   ├── App.jsx           # Main application component
│   ├── App.css           # Global styles
│   └── main.jsx          # Application entry point
├── package.json
└── README.md
```

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd food-delivery/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5174
   ```

### **Build for Production**

```bash
npm run build
```

## 🎯 **Key Components**

### **Navbar**

- Sticky navigation with scroll effects
- Mobile hamburger menu
- Search functionality
- Cart icon with item count
- Smooth section scrolling

### **FoodDisplay**

- Dynamic food item rendering
- Category-based filtering
- Add to cart functionality
- Responsive grid layout

### **Cart**

- Complete shopping cart management
- Quantity controls and item removal
- Promo code system
- Order total calculations
- Empty state handling

### **Authentication**

- Form validation and error handling
- Modal popup for quick access
- Responsive design
- Toast notifications

## 🎨 **Styling Approach**

- **Mobile-First**: Responsive design starting from mobile
- **Custom CSS**: No external UI frameworks
- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Variables**: Consistent theming
- **Animations**: CSS transitions and keyframes
- **Accessibility**: Focus states and reduced motion support

## 📱 **Responsive Breakpoints**

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: > 768px

## 🔧 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 **Performance Optimizations**

- **Lazy Loading**: Images load on demand
- **Code Splitting**: Route-based code splitting
- **Optimized Images**: Proper image sizing
- **Minimal Dependencies**: Lightweight bundle
- **CSS Optimization**: Efficient styling

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**Built with ❤️ using React.js and modern web technologies**
