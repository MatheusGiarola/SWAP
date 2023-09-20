import { EmailIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputProps as ChakraInputProps,
  InputRightElement
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction, ReactNode, useState } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ name, label, type, error, leftAddon, rightAddon, ...rest }, ref) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <FormControl isInvalid={!!error} >
      {label && <FormLabel htmlFor={rest.id ?? name} >{label}</FormLabel>}

      <InputGroup>
        {leftAddon}

        <ChakraInput
          ref={ref}
          variant="outline"
          id={name}
          name={name}
          _focus={{ borderColor: "teal.200", borderWidth: '2px' }}
          type={show ? 'text' : type}
          {...rest}
        />

        {(type === 'password') ? (
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
       
          </InputRightElement>
        ) : (
          rightAddon
        )}

      </InputGroup>
      {error && (<FormErrorMessage>{error.message}</FormErrorMessage>)}
    </FormControl>);
}

export const Input = forwardRef(InputBase)