// import React from "react";
// import {View} from "react-native";
// import {Meta, StoryObj} from "@storybook/react-native";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "../input-otp";

// const meta: Meta<typeof InputOTP> = {
//   title: "InputOTP",
//   component: InputOTP,
//   parameters: {
//     layout: "centered",
//   },
//   argTypes: {
//     maxLength: {
//       control: "number",
//       description: "Maximum number of characters allowed in the OTP input.",
//       table: {
//         defaultValue: {
//           summary: "6",
//         },
//       },
//     },
//     disabled: {
//       control: "boolean",
//       description: "Whether the OTP input is disabled.",
//       table: {
//         defaultValue: {
//           summary: "false",
//         },
//       },
//     },
//     value: {
//       control: "text",
//       description: "Controlled value for the OTP input.",
//     },
//     onChange: {
//       control: false,
//       description: "Callback function called when the OTP value changes.",
//     },
//     className: {
//       control: "text",
//       description: "Additional CSS classes to apply to the OTP input.",
//     },
//   },
//   tags: ["autodocs"],
// };

// export default meta;

// type Story = StoryObj<typeof meta>;

// export const Default: Story = {
//   render: () => (
//     <InputOTP maxLength={6}>
//       <InputOTPGroup>
//         <InputOTPSlot index={0} />
//         <InputOTPSlot index={1} />
//         <InputOTPSlot index={2} />
//       </InputOTPGroup>
//       <InputOTPSeparator />
//       <InputOTPGroup>
//         <InputOTPSlot index={3} />
//         <InputOTPSlot index={4} />
//         <InputOTPSlot index={5} />
//       </InputOTPGroup>
//     </InputOTP>
//   ),
// };

// export const FourDigit: Story = {
//   render: () => (
//     <InputOTP maxLength={4}>
//       <InputOTPGroup>
//         <InputOTPSlot index={0} />
//         <InputOTPSlot index={1} />
//         <InputOTPSlot index={2} />
//         <InputOTPSlot index={3} />
//       </InputOTPGroup>
//     </InputOTP>
//   ),
// };

// export const EightDigit: Story = {
//   render: () => (
//     <InputOTP maxLength={8}>
//       <InputOTPGroup>
//         <InputOTPSlot index={0} />
//         <InputOTPSlot index={1} />
//         <InputOTPSlot index={2} />
//         <InputOTPSlot index={3} />
//       </InputOTPGroup>
//       <InputOTPSeparator />
//       <InputOTPGroup>
//         <InputOTPSlot index={4} />
//         <InputOTPSlot index={5} />
//         <InputOTPSlot index={6} />
//         <InputOTPSlot index={7} />
//       </InputOTPGroup>
//     </InputOTP>
//   ),
// };

// export const WithSeparator: Story = {
//   render: () => (
//     <InputOTP maxLength={6}>
//       <InputOTPGroup>
//         <InputOTPSlot index={0} />
//         <InputOTPSlot index={1} />
//       </InputOTPGroup>
//       <InputOTPSeparator />
//       <InputOTPGroup>
//         <InputOTPSlot index={2} />
//         <InputOTPSlot index={3} />
//       </InputOTPGroup>
//       <InputOTPSeparator />
//       <InputOTPGroup>
//         <InputOTPSlot index={4} />
//         <InputOTPSlot index={5} />
//       </InputOTPGroup>
//     </InputOTP>
//   ),
// };

// export const Disabled: Story = {
//   render: () => (
//     <InputOTP maxLength={6} disabled>
//       <InputOTPGroup>
//         <InputOTPSlot index={0} />
//         <InputOTPSlot index={1} />
//         <InputOTPSlot index={2} />
//       </InputOTPGroup>
//       <InputOTPSeparator />
//       <InputOTPGroup>
//         <InputOTPSlot index={3} />
//         <InputOTPSlot index={4} />
//         <InputOTPSlot index={5} />
//       </InputOTPGroup>
//     </InputOTP>
//   ),
// };

// export const Controlled: Story = {
//   render: () => {
//     const [value, setValue] = React.useState("");

//     return (
//       <View style={{gap: 16, alignItems: "center"}}>
//         <InputOTP maxLength={6} value={value} onChangeText={setValue}>
//           <InputOTPGroup>
//             <InputOTPSlot index={0} />
//             <InputOTPSlot index={1} />
//             <InputOTPSlot index={2} />
//           </InputOTPGroup>
//           <InputOTPSeparator />
//           <InputOTPGroup>
//             <InputOTPSlot index={3} />
//             <InputOTPSlot index={4} />
//             <InputOTPSlot index={5} />
//           </InputOTPGroup>
//         </InputOTP>
//         <View
//           style={{padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8}}
//         >
//           <View style={{fontSize: 14, color: "#666"}}>
//             Current value: {value || "Empty"}
//           </View>
//         </View>
//       </View>
//     );
//   },
// };
