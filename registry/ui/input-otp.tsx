// import {ComponentProps, useContext} from "react";
// import {
//   TextInputOTP,
//   TextInputOTPSlot,
//   TextInputOTPGroup,
//   TextInputOTPSeparator,
// } from "react-native-input-code-otp";
// import {tv} from "tailwind-variants";
// import tw from "twrnc";
// import {ThemeContext, themes} from "../theme";

// export type InputOTPGroupProps = {
//   className?: string;
//   baseClassName?: string;
// } & ComponentProps<typeof TextInputOTPGroup>;

// export type InputOTPProps = {
//   className?: string;
//   baseClassName?: string;
// } & ComponentProps<typeof TextInputOTP>;

// export type InputOTPSlotProps = {
//   className?: string;
//   baseClassName?: string;
// } & ComponentProps<typeof TextInputOTPSlot>;

// export const inputOTP = tv({
//   base: "flex flex-row items-center gap-2",
//   variants: {
//     disabled: {
//       true: "opacity-50",
//     },
//   },
// });

// export const inputOTPGroup = tv({base: "flex flex-row items-center"});

// export const inputOTPSlot = tv({
//   slots: {
//     base: "border-input relative flex h-9 w-9 items-center justify-center shadow-xs transition-all outline-none",
//     focused:
//       "relative flex h-9 w-9 items-center justify-center border-y border-r shadow-xs transition-all outline-none border-ring opacity-50",
//     text: "text-sm font-normal text-foreground",
//   },
// });

// export const InputOTP = ({
//   className,
//   baseClassName,
//   ...props
// }: InputOTPProps) => {
//   return (
//     <TextInputOTP
//       containerStyles={tw.style(
//         inputOTP({className: baseClassName || className}),
//       )}
//       {...props}
//     />
//   );
// };

// export const InputOTPSlot = ({
//   className,
//   baseClassName,
//   ...props
// }: InputOTPSlotProps) => {
//   const {base, focused, text} = inputOTPSlot();

//   return (
//     <TextInputOTPSlot
//       slotStyles={tw.style(
//         base({
//           className: baseClassName || className,
//         }),
//       )}
//       focusedSlotStyles={tw.style(focused())}
//       slotTextStyles={tw.style(text())}
//       {...props}
//     />
//   );
// };

// export function InputOTPGroup({
//   className,
//   baseClassName,
//   ...props
// }: InputOTPGroupProps) {
//   return (
//     <TextInputOTPGroup
//       groupStyles={tw.style(
//         inputOTPGroup({className: baseClassName || className}),
//       )}
//       {...props}
//     />
//   );
// }
// export const InputOTPSeparator = TextInputOTPSeparator;

import {
  TextInputOTP,
  TextInputOTPSlot,
  TextInputOTPGroup,
  TextInputOTPSeparator,
} from "react-native-input-code-otp";

export const InputOTP = TextInputOTP;
export const InputOTPSlot = TextInputOTPSlot;
export const InputOTPGroup = TextInputOTPGroup;
export const InputOTPSeparator = TextInputOTPSeparator;
