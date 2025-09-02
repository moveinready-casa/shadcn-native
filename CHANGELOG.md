# shadcn-native

## 0.2.1

### Patch Changes

- 0f40046: Fix dark mode handling for the tabs component

  To upgrade change the following line (#542) in the Tabs component to:

  ```tsx
  <Text className="text-foreground">{children}</Text>
  ```

## 0.2.0

### Minor Changes

- 7f3ff33: Added portaling to the following components:
  - Alert Dialog
  - Dialog
  - Sheet

  This change wires up the `Portal` integration for the components below (it was previously non-functional).

  If you are not using these components, no action is required. If you are using them and want to enable portaling, follow the steps below:

  Install the new dependencies:

  ```shell
  pnpm install @rn-primitives/portal
  ```

  Add the following to your project's root layout:

  ```tsx
  import {PortalHost} from "@rn-primitives/portal";

  <PortalHost name="dialog" />;
  ```

  Update the following code:

  **`alert-dialog.tsx`:**

  ```tsx
  + import {Portal} from "@rn-primitives/portal";

  + /**
  +  * The alert dialog portal component.
  +  * @param param0 - Props to configure the behavior of the alert dialog portal. @see AlertDialogPortalComponentProps
  +  * @returns Returns a `Portal` which wraps the alert dialog content.
  +  */
  + export function AlertDialogPortal({
  +   children,
  +   forceMount,
  +   ...props
  + }: AlertDialogPortalComponentProps) {
  +   const context = useContext(AlertDialogContext);
  +   if (!context.state.isOpen && !forceMount) {
  +     return null;
  +   }
  +
  +   return Platform.OS === "web" ? (
  +     createPortal(
  +       <AlertDialogContext.Provider value={context}>
  +         <div {...props} className="absolute inset-0 h-full w-full">
  +           {children}
  +         </div>
  +       </AlertDialogContext.Provider>,
  +       // @ts-expect-error - Document is only used on web
  +       document.body,
  +     )
  +   ) : (
  +     <Portal {...props}>
  +       <AlertDialogContext.Provider value={context}>
  +         <View className="absolute inset-0 h-full w-full">{children}</View>
  +       </AlertDialogContext.Provider>
  +     </Portal>
  +   );
  + }
  ```

  **`dialog.tsx`:**

  ```tsx
  + import {Portal} from "@rn-primitives/portal";

  + /**
  +  * The dialog portal component.
  +  * @param param0 - Props to configure the behavior of the dialog portal. @see DialogPortalComponentProps
  +  * @returns Returns a `View` which wraps the dialog content.
  +  */
  + export function DialogPortal({children, ...props}: DialogPortalComponentProps) {
  +   const context = useContext(DialogContext);
  +   if (!context.state.isOpen) {
  +     return;
  +   }
  +   return Platform.OS === "web" ? (
  +     createPortal(
  +       <DialogContext.Provider value={context}>
  +         <div {...props} className="absolute inset-0 h-full w-full">
  +           {children}
  +         </div>
  +       </DialogContext.Provider>,
  +       // @ts-expect-error - Document is only used on web
  +       document.body,
  +     )
  +   ) : (
  +     <Portal {...props}>
  +       <DialogContext.Provider value={context}>
  +         <View className="absolute inset-0 h-full w-full">{children}</View>
  +       </DialogContext.Provider>
  +     </Portal>
  +   );
  + }
  ```

  **`sheet.tsx`:**

  ```tsx
  + import {Portal} from "@rn-primitives/portal";

  + /**
  +  * The sheet portal component.
  +  * @param param0 - Props to configure the behavior of the sheet portal. @see SheetPortalComponentProps
  +  * @returns Returns a `View` which wraps the sheet content.
  +  */
  + export function SheetPortal({children, ...props}: SheetPortalComponentProps) {
  +   const context = useContext(SheetContext);
  +   if (!context.state.isOpen) {
  +     return;
  +   }
  +
  +   return Platform.OS === "web" ? (
  +     createPortal(
  +       <SheetContext.Provider value={context}>
  +         <div {...props} className="absolute inset-0 h-full w-full">
  +           {children}
  +         </div>
  +       </SheetContext.Provider>,
  +       // @ts-expect-error - Document is only used on web
  +       document.body,
  +     )
  +   ) : (
  +     <Portal {...props}>
  +       <SheetContext.Provider value={context}>
  +         <View className="absolute inset-0 h-full w-full">{children}</View>
  +       </SheetContext.Provider>
  +     </Portal>
  +   );
  + }
  ```

  Learn more about portling and why you would want it [here](https://rnprimitives.com/portal/).
