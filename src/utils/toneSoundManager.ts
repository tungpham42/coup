import * as Tone from "tone";

export class ToneSoundManager {
  private synth: Tone.PolySynth;
  private membrane: Tone.MembraneSynth;
  private metal: Tone.MetalSynth;
  private isInitialized = false;

  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.membrane = new Tone.MembraneSynth().toDestination();
    this.metal = new Tone.MetalSynth().toDestination();

    // Thiết lập volume tổng
    Tone.Destination.volume.value = -8;
  }

  async initialize() {
    if (this.isInitialized) return;

    await Tone.start();
    this.isInitialized = true;
  }

  // Âm thanh di chuyển - click nhẹ
  playMove() {
    if (!this.isInitialized) return;

    this.synth.triggerAttackRelease("C6", "8n", Tone.now(), 0.3);
  }

  // Âm thanh ăn quân - tiếng trống
  playCapture() {
    if (!this.isInitialized) return;

    this.membrane.triggerAttackRelease("C2", "8n", Tone.now());
  }

  // Âm thanh lật bài - tiếng kim loại nhẹ
  playReveal() {
    if (!this.isInitialized) return;

    this.metal.triggerAttackRelease("C4", "16n", Tone.now(), 0.5);
  }

  // Âm thanh chiếu tướng - cảnh báo
  playCheck() {
    if (!this.isInitialized) return;

    this.synth.triggerAttackRelease(["G4", "B4", "D5"], "2n", Tone.now(), 0.6);
  }

  // Âm thanh thắng - hòa âm vui vẻ
  playWin() {
    if (!this.isInitialized) return;

    const now = Tone.now();
    this.synth.triggerAttackRelease("C4", "2n", now, 0.5);
    this.synth.triggerAttackRelease("E4", "2n", now + 0.1, 0.5);
    this.synth.triggerAttackRelease("G4", "2n", now + 0.2, 0.5);
    this.synth.triggerAttackRelease("C5", "2n", now + 0.3, 0.5);
  }

  // Âm thanh thua - hòa âm buồn
  playLose() {
    if (!this.isInitialized) return;

    const now = Tone.now();
    this.synth.triggerAttackRelease("C4", "2n", now, 0.4);
    this.synth.triggerAttackRelease("Eb4", "2n", now + 0.1, 0.4);
    this.synth.triggerAttackRelease("G4", "2n", now + 0.2, 0.4);
    this.synth.triggerAttackRelease("C5", "2n", now + 0.3, 0.4);
  }

  // Điều chỉnh volume
  setVolume(volume: number) {
    Tone.Destination.volume.value = volume;
  }
}
