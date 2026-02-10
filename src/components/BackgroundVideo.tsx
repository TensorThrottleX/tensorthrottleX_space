<motion.div
    style={{ filter: `blur(${blur})` }}
    className="absolute inset-0 w-full h-full"
>
    <video
        autoPlay
        loop
        muted
        playsInline
        className="object-cover w-full h-full grayscale-[0.4] brightness-110 contrast-105"
    >
        <source src="/background.mp4" type="video/mp4" />
    </video>
</motion.div>

{/* Readability Overlay */ }
<div className="absolute inset-0 bg-black/35" />

{/* Vignette */ }
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />

{/* Noise */ }
<div
    className="absolute inset-0 opacity-[0.025] mix-blend-soft-light"
    style={{ backgroundImage: `url("data:image/svg+xml,...")` }}
/>
