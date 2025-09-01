---
"shadcn-native": patch
---

Fix dark mode handling for the tabs component

To upgrade change the following line (#542) in the Tabs component to:

```tsx
<Text className="text-foreground">{children}</Text>
```
