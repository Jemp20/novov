import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Drops from './components/Drops'
import Catalog from './components/Catalog'
import About from './components/About'
import Contact from './components/Contact' 
import Cart from './components/Cart'
import Footer from './components/Footer'
import Checkout from "./components/Checkout"
import Reviews from './components/Reviews'

export default function AppStore() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // Cursor personalizado
  const cursorRef = useRef(null)
  const ringRef   = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const ring   = ringRef.current
    if (!cursor || !ring) return

    const move = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
      ring.style.left   = e.clientX + 'px'
      ring.style.top    = e.clientY + 'px'
    }

    const expand = () => {
      ring.style.width   = '56px'
      ring.style.height  = '56px'
      ring.style.opacity = '0.25'
    }
    const shrink = () => {
      ring.style.width   = '36px'
      ring.style.height  = '36px'
      ring.style.opacity = '0.45'
    }

    document.addEventListener('mousemove', move)
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      document.removeEventListener('mousemove', move)
    }
  }, [])

  // Lógica del carrito
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setCartOpen(true)
  }

  const removeOne = (index) => {
    setCart(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], qty: updated[index].qty - 1 }
      if (updated[index].qty <= 0) updated.splice(index, 1)
      return updated
    })
  }

  const addOne = (index) => {
    setCart(prev => prev.map((item, i) =>
      i === index ? { ...item, qty: item.qty + 1 } : item
    ))
  }

  const deleteItem = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <>
      {/* Cursor personalizado */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <Navbar onCartOpen={() => setCartOpen(true)} cartCount={cartCount} />

      <main>
        <Hero />
        <Marquee />
        <Drops onAddToCart={addToCart} />
        <Catalog onAddToCart={addToCart} />
        <About />
        <Contact />
        <Reviews />
      </main>

      <Footer />

      {cartOpen && (
        <Cart
          cart={cart}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onAdd={addOne}
          onRemove={removeOne}
          onDelete={deleteItem}
          onCheckout={() => {
            setCartOpen(false)
            setCheckoutOpen(true)
          }}
        />
      )}

      {checkoutOpen && <Checkout cart={cart} onClose={() => setCheckoutOpen(false)} />}
         
    </>
  )
}
