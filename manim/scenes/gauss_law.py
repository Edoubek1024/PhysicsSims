from manim import *
import numpy as np

class GaussLaw(Scene):
    def construct(self):
        self.camera.background_color = "#0f172a"

        title = Text("Gauss's Law", font_size=44).to_edge(UP)
        formula = MathTex(r"\Phi_E = \frac{q_{\text{enc}}}{\varepsilon_0}", font_size=48).to_edge(DOWN)

        charge = Circle(radius=0.35, color=RED, fill_opacity=0.9)
        chargeLabel = MathTex("+q", color=WHITE).move_to(charge)

        surface = Circle(radius=2.0, color=BLUE_A, stroke_width=4)
        surfaceLabel = Text("Gaussian Surface", font_size=24, color=BLUE_A).next_to(surface, UP)

        arrows = VGroup()
        for angle in np.linspace(0, TAU, 16, endpoint=False):
            start = 0.75 * np.array([np.cos(angle), np.sin(angle), 0])
            end = 1.75 * np.array([np.cos(angle), np.sin(angle), 0])
            arrows.add(Arrow(start, end, buff=0, color=YELLOW, stroke_width=3))

        note = Text("Electric flux measures field passing through a surface", font_size=26, color=YELLOW).next_to(title, DOWN)

        self.play(Write(title))
        self.play(FadeIn(charge), Write(chargeLabel))
        self.play(Create(surface), Write(surfaceLabel))
        self.play(LaggedStart(*[GrowArrow(a) for a in arrows], lag_ratio=0.05))
        self.play(Write(note))
        self.play(Write(formula))
        self.wait(1.5)