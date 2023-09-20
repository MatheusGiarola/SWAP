import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  shouldMatchExatcHref?: boolean;
}

export function ActiveLink({
  children,
  shouldMatchExatcHref = false,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter()
  let isActive = false

  if (shouldMatchExatcHref && (asPath === rest.href || asPath === rest.as)) {
    isActive = true
  }

  if (!shouldMatchExatcHref &&
    (asPath.startsWith(String(rest.href)) ||
      asPath.startsWith(String(rest.as)))) {
    isActive = true
  }

  return (
    <Link {...rest}>
      {cloneElement(children, {
        color: isActive ? "teal.500" : "gray.500",
      })}
    </Link>
  )
}