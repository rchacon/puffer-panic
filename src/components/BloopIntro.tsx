import bloopSpectrogram from "../assets/bloop-spectrogram.jpg";

// Title-card flourish shown right before a Bloop (level 10, and every time
// the cycle comes back around to it) game begins -- see AGENTS.md. Unlike
// the Kraken/Megalodon's vendored creature-silhouette icon, the visual here
// is the actual NOAA spectrogram of the real recording (public domain, a
// US federal government work -- see AGENTS.md for provenance), since the
// point of this boss is the real thing, not a drawn stand-in for it. No
// spoken voice line either, for the same reason: App.tsx plays the
// recording itself instead (BOSS_INTROS.bloop has no voiceCue).
export function BloopIntro() {
  return (
    <div className="bloop-intro" role="alert">
      <img className="bloop-intro__spectrogram" src={bloopSpectrogram} alt="" aria-hidden="true" />
      <p className="bloop-intro__text">The loudest sound ever heard in the ocean.</p>
    </div>
  );
}
