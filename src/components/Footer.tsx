import { motion } from 'framer-motion'
import { profile } from '../config'
import './Footer.css'

export function Footer() {
  return (
    <motion.footer
      className="footer container"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <span className="footer__name">{profile.name}</span>
      <span className="footer__note">
        © {new Date().getFullYear()} — no rights reserved. they were taken.
      </span>
    </motion.footer>
  )
}
