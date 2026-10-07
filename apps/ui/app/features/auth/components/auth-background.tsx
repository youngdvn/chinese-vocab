"use client"

import { useEffect, useRef } from "react"

interface Node {
    x: number
    y: number
    z: number
    vx: number
    vy: number
    radius: number
}

export default function AuthBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) return

        const ctx = canvas.getContext("2d")

        if (!ctx) return

        let animationFrameId = 0

        const nodes: Node[] = []

        let width = 0
        let height = 0

        const isMobile = () => window.innerWidth < 768

        const createNodes = () => {
            nodes.length = 0

            const mobile = isMobile()
            const count = mobile ? 45 : 90

            for (let i = 0; i < count; i++) {
                const side = Math.random() > 0.5 ? "left" : "right"

                const x =
                    side === "left"
                        ? Math.random() * width * 0.45
                        : width * 0.55 +
                        Math.random() * width * 0.45

                nodes.push({
                    x,
                    y: Math.random() * height,
                    z: Math.random(),
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 1.4 + 0.4,
                })
            }
        }

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)

            width = window.innerWidth
            height = window.innerHeight

            canvas.width = width * dpr
            canvas.height = height * dpr

            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            createNodes()
        }

        const drawBackground = () => {
            ctx.fillStyle = "#050505"
            ctx.fillRect(0, 0, width, height)

            // Center darkness
            const gradient = ctx.createRadialGradient(
                width / 2,
                height / 2,
                0,
                width / 2,
                height / 2,
                width * 0.55,
            )

            gradient.addColorStop(0, "rgba(5,5,5,1)")
            gradient.addColorStop(0.5, "rgba(5,5,5,0.85)")
            gradient.addColorStop(1, "rgba(5,5,5,0.15)")

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)
        }

        const updateNodes = () => {
            nodes.forEach((node) => {
                node.x += node.vx
                node.y += node.vy

                // Bounce vertically
                if (node.y < 0 || node.y > height) {
                    node.vy *= -1
                }

                // Keep nodes on their respective side
                const centerGap = width * 0.08

                if (node.x < width / 2 - centerGap) {
                    if (node.x < 0) {
                        node.x = 0
                        node.vx *= -1
                    }
                } else {
                    if (node.x > width) {
                        node.x = width
                        node.vx *= -1
                    }
                }
            })
        }

        const drawConnections = () => {
            const maxDistance = isMobile() ? 90 : 125

            for (let i = 0; i < nodes.length; i++) {
                const nodeA = nodes[i]

                if (!nodeA) continue

                for (let j = i + 1; j < nodes.length; j++) {
                    const nodeB = nodes[j]

                    if (!nodeB) continue

                    // Don't connect across center
                    const sameSide =
                        (nodeA.x < width / 2 &&
                            nodeB.x < width / 2) ||
                        (nodeA.x >= width / 2 &&
                            nodeB.x >= width / 2)

                    if (!sameSide) continue

                    const dx = nodeA.x - nodeB.x
                    const dy = nodeA.y - nodeB.y

                    const distance = Math.sqrt(
                        dx * dx + dy * dy,
                    )

                    if (distance > maxDistance) continue

                    const opacity =
                        (1 - distance / maxDistance) * 0.22

                    ctx.beginPath()
                    ctx.moveTo(nodeA.x, nodeA.y)
                    ctx.lineTo(nodeB.x, nodeB.y)

                    ctx.strokeStyle = `rgba(255,255,255,${opacity})`
                    ctx.lineWidth = 0.5

                    ctx.stroke()
                }
            }
        }

        const drawNodes = () => {
            nodes.forEach((node) => {
                // Glow
                const glow = ctx.createRadialGradient(
                    node.x,
                    node.y,
                    0,
                    node.x,
                    node.y,
                    node.radius * 5,
                )

                glow.addColorStop(
                    0,
                    "rgba(255,255,255,0.25)",
                )

                glow.addColorStop(
                    1,
                    "rgba(255,255,255,0)",
                )

                ctx.beginPath()
                ctx.fillStyle = glow

                ctx.arc(
                    node.x,
                    node.y,
                    node.radius * 5,
                    0,
                    Math.PI * 2,
                )

                ctx.fill()

                // Core
                ctx.beginPath()
                ctx.fillStyle = "rgba(255,255,255,0.65)"

                ctx.arc(
                    node.x,
                    node.y,
                    node.radius,
                    0,
                    Math.PI * 2,
                )

                ctx.fill()
            })
        }

        const animate = () => {
            drawBackground()

            updateNodes()
            drawConnections()
            drawNodes()

            animationFrameId =
                requestAnimationFrame(animate)
        }

        resize()
        animate()

        window.addEventListener("resize", resize)

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener("resize", resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 "
        />
    )
}