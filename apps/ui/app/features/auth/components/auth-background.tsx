"use client"

import { useEffect, useRef } from "react"

interface Node {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
}

export default function AuthBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const SPEED = 0.5

    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) return

        const ctx = canvas.getContext("2d")

        if (!ctx) return

        let animationFrameId = 0

        let width = 0
        let height = 0

        const nodes: Node[] = []

        const isDarkMode = () => {
            return document.documentElement.classList.contains("dark")
        }

        const isMobile = () => {
            return window.innerWidth < 768
        }

        const resize = () => {
            const dpr = Math.min(
                window.devicePixelRatio || 1,
                2,
            )

            width = window.innerWidth
            height = window.innerHeight

            canvas.width = width * dpr
            canvas.height = height * dpr

            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0,
            )

            createNodes()
        }

        const createNodes = () => {
            nodes.length = 0

            const mobile = isMobile()

            const count = mobile ? 45 : 90

            for (let i = 0; i < count; i++) {
                const isLeft = Math.random() > 0.5

                const x = isLeft
                    ? Math.random() * width * 0.45
                    : width * 0.55 +
                    Math.random() * width * 0.45

                const speed =
                    Math.random() * SPEED + SPEED * 0.4

                nodes.push({
                    x,
                    y: Math.random() * height,

                    vx:
                        (Math.random() - 0.5) *
                        speed,

                    vy:
                        (Math.random() - 0.5) *
                        speed,

                    radius:
                        Math.random() * 1.4 + 0.4,
                })
            }
        }

        const drawBackground = () => {
            const dark = isDarkMode()

            ctx.fillStyle = dark
                ? "#050505"
                : "#f8fafc"

            ctx.fillRect(
                0,
                0,
                width,
                height,
            )

            const gradient =
                ctx.createRadialGradient(
                    width / 2,
                    height / 2,
                    0,

                    width / 2,
                    height / 2,
                    width * 0.65,
                )

            if (dark) {
                gradient.addColorStop(
                    0,
                    "rgba(5,5,5,1)",
                )

                gradient.addColorStop(
                    0.45,
                    "rgba(5,5,5,0.92)",
                )

                gradient.addColorStop(
                    1,
                    "rgba(5,5,5,0.15)",
                )
            } else {
                gradient.addColorStop(
                    0,
                    "rgba(248,250,252,1)",
                )

                gradient.addColorStop(
                    0.45,
                    "rgba(248,250,252,0.92)",
                )

                gradient.addColorStop(
                    1,
                    "rgba(248,250,252,0.15)",
                )
            }

            ctx.fillStyle = gradient

            ctx.fillRect(
                0,
                0,
                width,
                height,
            )
        }

        const updateNodes = () => {
            nodes.forEach((node) => {
                node.x += node.vx
                node.y += node.vy
                if (
                    node.y <= 0 ||
                    node.y >= height
                ) {
                    node.vy *= -1
                }

                if (
                    node.x <= 0 ||
                    node.x >= width
                ) {
                    node.vx *= -1
                }
            })
        }

        const drawConnections = () => {
            const dark = isDarkMode()

            const maxDistance = isMobile()
                ? 90
                : 125

            for (
                let i = 0;
                i < nodes.length;
                i++
            ) {
                const nodeA = nodes[i]

                if (!nodeA) continue

                for (
                    let j = i + 1;
                    j < nodes.length;
                    j++
                ) {
                    const nodeB = nodes[j]

                    if (!nodeB) continue

                    const sameSide =
                        (nodeA.x < width / 2 &&
                            nodeB.x < width / 2) ||
                        (nodeA.x >= width / 2 &&
                            nodeB.x >= width / 2)

                    if (!sameSide) continue

                    const dx =
                        nodeA.x - nodeB.x

                    const dy =
                        nodeA.y - nodeB.y

                    const distance = Math.sqrt(
                        dx * dx + dy * dy,
                    )

                    if (
                        distance >
                        maxDistance
                    ) {
                        continue
                    }

                    const opacity =
                        (1 -
                            distance /
                            maxDistance) *
                        0.22

                    ctx.beginPath()

                    ctx.moveTo(
                        nodeA.x,
                        nodeA.y,
                    )

                    ctx.lineTo(
                        nodeB.x,
                        nodeB.y,
                    )

                    ctx.strokeStyle = dark
                        ? `rgba(255,255,255,${opacity})`
                        : `rgba(0,0,0,${opacity * 0.7})`

                    ctx.lineWidth = 0.5

                    ctx.stroke()
                }
            }
        }

        const drawNodes = () => {
            const dark = isDarkMode()

            nodes.forEach((node) => {
                /*
                 * Glow
                 */
                const glow =
                    ctx.createRadialGradient(
                        node.x,
                        node.y,
                        0,

                        node.x,
                        node.y,
                        node.radius * 6,
                    )

                if (dark) {
                    glow.addColorStop(
                        0,
                        "rgba(255,255,255,0.25)",
                    )

                    glow.addColorStop(
                        1,
                        "rgba(255,255,255,0)",
                    )
                } else {
                    glow.addColorStop(
                        0,
                        "rgba(0,0,0,0.16)",
                    )

                    glow.addColorStop(
                        1,
                        "rgba(0,0,0,0)",
                    )
                }

                ctx.beginPath()

                ctx.fillStyle = glow

                ctx.arc(
                    node.x,
                    node.y,
                    node.radius * 6,
                    0,
                    Math.PI * 2,
                )

                ctx.fill()

                /*
                 * Node core
                 */
                ctx.beginPath()

                ctx.fillStyle = dark
                    ? "rgba(255,255,255,0.65)"
                    : "rgba(0,0,0,0.5)"

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
                requestAnimationFrame(
                    animate,
                )
        }

        resize()

        animate()
        window.addEventListener(
            "resize",
            resize,
        )

        const observer =
            new MutationObserver(() => {

            })

        observer.observe(
            document.documentElement,
            {
                attributes: true,
                attributeFilter: ["class"],
            },
        )

        return () => {
            cancelAnimationFrame(
                animationFrameId,
            )

            window.removeEventListener(
                "resize",
                resize,
            )

            observer.disconnect()
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        />
    )
}