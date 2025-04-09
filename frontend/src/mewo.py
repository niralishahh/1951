import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import hilbert

# Simulate an LFP signal: a mix of two sinusoids with noise
fs = 1000  # Sampling frequency in Hz
t = np.arange(0, 1, 1/fs)  # Time vector for 1 second
lfp = np.sin(2 * np.pi * 10 * t) + 0.5 * np.sin(2 * np.pi * 20 * t) + 0.1 * np.random.randn(len(t))

# Compute the analytic signal using the Hilbert transform
analytic_signal = hilbert(lfp)
amplitude_envelope = np.abs(analytic_signal)
instantaneous_phase = np.angle(analytic_signal)

# Construct three graphs

plt.figure(figsize=(12, 10))

# Graph 1: Original LFP Signal
plt.subplot(3, 1, 1)
plt.plot(t, lfp, label="LFP Signal", color='blue')
plt.title("Original LFP Signal")
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.legend()
plt.grid(True)

# Graph 2: Amplitude Envelope
plt.subplot(3, 1, 2)
plt.plot(t, amplitude_envelope, label="Amplitude Envelope", color='orange')
plt.title("Amplitude Envelope of LFP Signal")
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.legend()
plt.grid(True)

# Graph 3: Instantaneous Phase
plt.subplot(3, 1, 3)
plt.plot(t, instantaneous_phase, label="Instantaneous Phase", color='green')
plt.title("Instantaneous Phase of LFP Signal")
plt.xlabel("Time (s)")
plt.ylabel("Phase (radians)")
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()