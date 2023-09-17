export interface DispenserPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
