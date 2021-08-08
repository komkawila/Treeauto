int getLDR() {
  return map(analogRead(LDR_PIN), 0, 1023, 100, 0);
}
