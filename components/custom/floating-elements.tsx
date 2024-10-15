import { motion, useAnimation } from "framer-motion"


const FloatingElement = ({ children, x, y, duration }: {
    children: React.ReactNode
    x: number
    y: number
    duration: number
}) => (
    <motion.div
        className="absolute"
        animate={{
            x: [0, x, 0],
            y: [0, y, 0],
        }}
        transition={{
            repeat: Infinity,
            duration: duration,
            ease: "easeInOut",
        }}
    >
        {children}
    </motion.div>
)

export default FloatingElement;