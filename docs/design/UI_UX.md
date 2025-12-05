# UI/UX Design Guidelines: "iOS 26" Glassmorphism

This document defines the visual language for the AgroFlow frontend. The goal is to achieve a futuristic, premium feel inspired by a hypothetical "iOS 26" aesthetic.

## Core Philosophy: "Deep Glass"

The interface should feel like a stack of intelligent, translucent layers floating in 3D space.

### 1. Materials & Transparency
- **Glass Surfaces**: Primary containers are not solid. They use heavy background blur (`backdrop-filter: blur(20px+)`) with high transparency.
- **Layering**: Use `z-index` and varying levels of opacity to imply depth. Deeper layers are darker/more blurred; top layers are lighter and sharper.
- **Lighting**: Subtle white/inner borders (`1px solid rgba(255,255,255,0.1)`) to catch the "light" on edges.
- **Result**: Content takes on the color context of the background without losing legibility.

### 2. Colors & Gradients
- **Backgrounds**: Never plain flat colors. Use rich, flowing, deep gradients (aurora borealis style, deep violets, teals, warm oranges) that shift slowly or react to scroll/mouse.
- **Vibrancy**: Colors should be "electric" but diffused through the glass materials.
- **Dark Mode First**: The system is dark-mode native. Light mode (if strictly needed) should feel like "frosted ice" rather than plain white paper.

### 3. Geometry & Typography
- **Super-Round Corners**: Cards and modals use generous border-radius (e.g., `24px` to `40px`). Buttons are pill-shaped.
- **Typography**:
  - Font: System UI (San Francisco on Apple, etc.) or Inter/Outfit for consistency.
  - Weights: Heavy use of varied weights. Bold headers, thinner body text.
  - Tracking: Slightly tighter tracking for display text.
- **Floating Elements**: nothing touches the screen edges unless necessary (like a tab bar). Content floats.

### 4. Motion & Interactivity
- **Physics**: Animations should feel physically grounded (springs), not linear.
- **Micro-interactions**: Every tap has a tactile response (scale down slightly, ripple).
- **Parallax**: Subtle movement of background layers vs foreground layers.

## Component Examples

**Card (The "Glass Tile"):**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border-radius: 24px;
}
```

**Workflow Specifics:**
- **Worker View**: Large, touch-friendly tap targets. "Juicy" completion animations (green glow bursts) when marking a task done.
- **Board View**: Swimlanes are horizontal belts of darker glass. Tickets are brighter glass tiles floating above them.

## Technical Constraints
- Performance: Watch out for excessive `backdrop-filter` on low-end mobile devices. Fallback to solid semi-transparent colors if necessary.
- Accessibility: Ensure contrast ratios remain high for text on glass. Use text-shadows if needed to separate text from dynamic backgrounds.
