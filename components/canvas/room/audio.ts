const SONGS = [
  "/bgm/Gregory Alan Isakov - Amsterdam.mp3",
  "/bgm/Gregory Alan Isakov - Second Chances.mp3",
];

let audioInstance: HTMLAudioElement | null = null;
let currentSongIndex = 0;

export function getAudio(): HTMLAudioElement {
  if (!audioInstance) {
    audioInstance = new Audio(SONGS[currentSongIndex]);
    audioInstance.volume = 0.3;
    audioInstance.loop = false;
    audioInstance.addEventListener("ended", () => {
      currentSongIndex = (currentSongIndex + 1) % SONGS.length;
      audioInstance!.src = SONGS[currentSongIndex];
      audioInstance!.play().catch(() => {});
    });
  }
  return audioInstance;
}
