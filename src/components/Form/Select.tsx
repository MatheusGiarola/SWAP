import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface SelectProps extends ChakraSelectProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = ({ name, label, error, children, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error} >
      {label && <FormLabel htmlFor={rest.id ?? name} >{label}</FormLabel>}

      <ChakraSelect
        ref={ref}
        variant="outline"
        id={name}
        name={name}
        position="relative"
        _focus={{ borderColor: "teal.200", borderWidth: '2px'}}
        {...rest}
      >
        {children}
      </ChakraSelect>

      {error && (<FormErrorMessage>{error.message}</FormErrorMessage>)}
    </FormControl>);
}

export const Select = forwardRef(SelectBase)