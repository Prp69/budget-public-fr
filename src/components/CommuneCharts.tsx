Failed to compile.
./src/components/CommuneCharts.tsx:198:19
Type error: Type '(props: Record<string, number>) => JSX.Element | null' is not assignable to type 'PieLabel | undefined'.
  Type '(props: Record<string, number>) => JSX.Element | null' is not assignable to type '(props: PieLabelRenderProps) => ReactNode | ReactElement<SVGElement, string | JSXElementConstructor<any>>'.
    Types of parameters 'props' and 'props' are incompatible.
      Type 'PieLabelRenderProps' is not assignable to type 'Record<string, number>'.
        Index signature for type 'string' is missing in type 'PieLabelRenderProps'.
  196 |                   dataKey="value"
  197 |                   labelLine={false}
> 198 |                   label={renderCustomLabel}
      |                   ^
  199 |                 >
  200 |                   {pieData.map((entry, i) => (
  201 |                     <Cell key={i} fill={entry.color} />
Next.js build worker exited with code: 1 and signal: null
Error: Command "npm run build" exited with 1