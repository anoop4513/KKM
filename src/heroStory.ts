export const chapters = [
  { label: '01 / THE STORY', title: 'Every brand has\na story.', body: 'We find what makes yours different. And give it a voice.' },
  { label: '02 / THE CRAFT', title: 'We make\npeople feel it.', body: 'Cinematic films. Thoughtful campaigns. Social content with something to say.' },
  { label: '03 / THE IMPACT', title: 'From your story.\nTo their world.', body: 'Rooted in Hindupur. Creating for schools, creators and ambitious brands across India.' },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

// Opaque base plus three overlapping dissolve layers. Each new generated pose
// fully replaces the previous pose, avoiding a dim background during a dissolve.
export function reelLayers(progress: number) {
  const p = clamp(progress);
  return [1, smooth((p - .12) / .16), smooth((p - .4) / .16), smooth((p - .7) / .16)];
}

// A reversible timeline: all animation values depend only on scroll position.
export function storyFrame(progress: number) {
  const p = clamp(progress);
  const first = smooth((p - .04) / .12);
  const second = smooth((p - .34) / .12);
  const third = smooth((p - .67) / .12);
  return {
    progress: p,
    opacity: [first * (1 - second), second * (1 - third), third],
    scale: 1 + .025 * Math.sin(Math.PI * p),
    rotate: -.6 * Math.sin(2 * Math.PI * p),
    depth: 1.5 * Math.sin(Math.PI * p),
    shift: .5 * Math.sin(Math.PI * p),
    shade: first,
  };
}
