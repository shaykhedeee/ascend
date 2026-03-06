/**
 * Terminal UI Component System
 * ═══════════════════════════════════════════════
 * Research-driven terminal components inspired by
 * btop, tig, ranger, cava, charm.sh/gum, bpytop
 */

export { default as TerminalWindow } from "./TerminalWindow";
export type { TerminalWindowProps, TerminalLine } from "./TerminalWindow";

export { default as StatusBar } from "./StatusBar";
export type { StatusBarProps, StatusItem } from "./StatusBar";

export { default as ProgressBar } from "./ProgressBar";
export type { ProgressBarProps } from "./ProgressBar";

export { default as ASCIIBox } from "./ASCIIBox";
export type { ASCIIBoxProps, BoxStyle } from "./ASCIIBox";

export { default as KeyboardHints } from "./KeyboardHints";
export type { KeyboardHintsProps, KeyHint } from "./KeyboardHints";

export { default as SparklineBars } from "./SparklineBars";
export type { SparklineBarsProps } from "./SparklineBars";

export { default as TerminalOutput } from "./TerminalOutput";
export type { TerminalOutputProps, OutputType } from "./TerminalOutput";
