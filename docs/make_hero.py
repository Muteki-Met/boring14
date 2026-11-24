"""Compone docs/hero.png per il README a partire dagli screenshot *-phone.png.
Uso: python make_hero.py   (da dentro docs/, serve ImageMagick `magick`)."""
import math
import subprocess

# Stessa palette di challenge.js (OKLCH), resa un po' più intensa per i pallini.
DAYS = [(0.85, 0.09, 30), (0.87, 0.09, 60), (0.92, 0.09, 95), (0.9, 0.09, 130), (0.88, 0.08, 165), (0.88, 0.07, 205), (0.85, 0.08, 245),
        (0.84, 0.08, 278), (0.84, 0.09, 305), (0.85, 0.09, 330), (0.86, 0.08, 355), (0.84, 0.09, 15), (0.88, 0.07, 50), (0.89, 0.1, 85)]


def oklch_hex(L, c, h):
    a, b = c * math.cos(math.radians(h)), c * math.sin(math.radians(h))
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    rgb = (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
           -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
           -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
    f = lambda x: max(0.0, min(1.0, 12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055))
    return '#%02X%02X%02X' % tuple(round(f(v) * 255) for v in rgb)


B, R = 'C:/Windows/Fonts/segoeuib.ttf', 'C:/Windows/Fonts/segoeui.ttf'
cmd = ['magick', '-size', '2400x1300', 'gradient:#FFE3D8-#E3E9FF',
       '(', '-size', '2400x1300', 'radial-gradient:#F4FFE6-none', ')', '-compose', 'over', '-composite',
       '(', 'today-phone.png', '-resize', '92%', ')', '-gravity', 'northwest', '-geometry', '+1000+150', '-composite',
       '(', 'food-phone.png', '-resize', '80%', ')', '-geometry', '+1440+260', '-composite',
       '(', 'progress-phone.png', '-resize', '80%', ')', '-geometry', '+1830+260', '-composite',
       '-font', B, '-fill', '#24161f', '-pointsize', '150', '-annotate', '+120+300', 'Boring 14',
       '-font', R, '-fill', '#4a3b48', '-pointsize', '54', '-annotate', '+128+520', 'A private 14-day habit challenge.',
       '-pointsize', '44', '-fill', '#6a5a66', '-annotate', '+128+610', 'Seven plain habits. One tape measure.',
       '-annotate', '+128+668', 'Every day has its own colour.']
for i, (L, c, h) in enumerate(DAYS):
    x = 150 + i * 62
    cmd += ['-fill', oklch_hex(L - 0.2, c + 0.06, h), '-draw', f'circle {x},800 {x + 22},800']
cmd += ['-depth', '8', '-resize', '1600x', 'hero.png']
subprocess.run(cmd, check=True)
print('hero.png ok')
