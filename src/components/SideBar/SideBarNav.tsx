import { Stack } from "@chakra-ui/react";
import { RiDashboardLine, RiContactsLine, RiInputMethodLine, RiGitMergeLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export default function SideBarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard" shouldMatchExatcHref={true}>Dashboard</NavLink>
        <NavLink icon={RiContactsLine} href="/users" >Usuários</NavLink>
      </NavSection>
    </Stack >
  )
}