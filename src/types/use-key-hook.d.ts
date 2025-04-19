declare module "use-key-hook" {
  export type KeyHandler = (event: KeyboardEvent) => void;
  export type KeyBinding = string | string[];
  export type KeyBindingConfig = {
    detectKeys: string | number | Array<string | number>;
  };
  export default function useKey(
    fn: KeyHandler,
    keys: KeyBinding | KeyBindingConfig
  ): void;
}
