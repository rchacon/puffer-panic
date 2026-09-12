import { useId, useMemo } from "react";
import piranhaArtwork from "../../assets/piranha.svg?raw";

const ID_ATTR = /\bid="([^"]+)"/g;

/**
 * Vendored SVGs with internal <defs>/gradients/filters (like this one) get
 * their ids hand-prefixed when there's only ever one on screen (see
 * kraken.svg's "kraken-" prefix). Piranha is different: it's rendered
 * `count` times at once (a school, see getSchoolOffsets), so the SAME raw
 * markup -- and the SAME ids -- get injected into the DOM several times
 * simultaneously. A static prefix baked into the file wouldn't help there;
 * every instance needs its OWN unique ids so `url(#...)` references can't
 * resolve to a sibling instance's gradient/filter definition instead of its
 * own (duplicate ids are invalid HTML/SVG, and which element "wins" a
 * fragment lookup isn't something worth relying on across browsers).
 */
function scopeIds(svg: string, suffix: string): string {
  const ids = new Set<string>();
  for (const m of svg.matchAll(ID_ATTR)) ids.add(m[1]);
  let out = svg;
  for (const id of ids) {
    const scoped = `${id}-${suffix}`;
    out = out
      .replaceAll(`id="${id}"`, `id="${scoped}"`)
      .replaceAll(`url(#${id})`, `url(#${scoped})`)
      .replaceAll(`xlink:href="#${id}"`, `xlink:href="#${scoped}"`)
      .replaceAll(`href="#${id}"`, `href="#${scoped}"`);
  }
  return out;
}

// Level 4's piranha (school of 4) -- a vendored illustration, not hand-drawn
// like Eel/Anglerfish/TapahCatfish/Mosasaurus. Recolored from its original
// teal palette to a grey body + red belly (a red-bellied piranha,
// Pygocentrus nattereri) -- see AGENTS.md for the source, license, and how
// the belly patch was added. Already drawn nose-left in its native
// orientation, same as every other creature here.
export function Piranha() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const scopedArtwork = useMemo(() => scopeIds(piranhaArtwork, uid), [uid]);

  return (
    <g className="piranha">
      <svg
        x={-78}
        y={-29}
        width={117}
        height={58.5}
        viewBox="0 0 500 250"
        dangerouslySetInnerHTML={{ __html: scopedArtwork }}
      />
    </g>
  );
}
