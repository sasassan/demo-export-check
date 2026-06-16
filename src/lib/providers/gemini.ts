export async function summarizeExternalSignals(signals: string[]) {
  return signals.join(" / ");
}