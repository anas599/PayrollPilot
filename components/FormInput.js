import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
  Center,
  NativeBaseProvider,
} from "native-base";

export const InputNativeBase = ({ onChangeText, payRate }) => {
  return (
    <Stack alignItems="center">
      <InputGroup
        w={{
          base: "70%",
          md: "285",
        }}
      >
        <InputLeftAddon children={"$"} />
        <Input
          w={{
            base: "70%",
            md: "100%",
          }}
          placeholder="nativebase"
          onChangeText={onChangeText}
          value={payRate}
        />
        <InputRightAddon children={"Per Hour"} />
      </InputGroup>
    </Stack>
  );
};
