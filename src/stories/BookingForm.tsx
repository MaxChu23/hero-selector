import {
  DateInput,
  FormSchema,
  GuestSelect,
  GuestOption,
  LocationSelect,
  useReactBookingForm,
  BookingForm as BookingFormType,
  LocationOption,
} from "../lib"
import tw from "tailwind-styled-components"
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaSpinner,
  FaPlus,
  FaMinus,
  FaUser,
} from "react-icons/fa"
import { cities } from "./dummy-data/cities"
import React from "react"

const Container = tw.div`rounded-full bg-white p-6 shadow-xl flex justify-between flex-col md:flex-row md:space-x-2 md:space-y-0 space-y-2`
const InputCore = tw.input`appearance-none border rounded-full w-full outline-none transition pl-4 pr-6 group-hover:border-green-500 focus:border-green-500 cursor-pointer`
const ControlCore = tw.div`appearance-none border rounded-full w-full outline-none transition pl-4 pr-6 group-hover:border-green-500 focus:border-green-500 cursor-pointer flex items-center`
const Placeholder = tw.div`text-gray-400 select-none`
const InputContainer = tw.div`relative w-full md:w-1/3 flex flex-col justify-center items-center pl-2`
const Label = tw.div`text-sm w-full font-bold mb-1 text-gray-500`

const ButtonText = tw.div`ml-2`
const MainButton = tw.button`appearance-none mt-5 border-0 w-full h-10 rounded-full flex justify-center items-center bg-green-500 text-white font-bold px-3`
const IconContainer = tw.button`z-20 absolute top-0 right-0 bottom-0 h-full flex items-center pr-2 cursor-pointer text-gray-500 transition`

const MenuContainer = tw.div`z-20`
const Menu = tw.ul<{ open: boolean }>`
  w-64 max-h-[240px] border z-20 transform transition ease-in-out bg-white rounded-3xl overflow-y-auto overflow-x-hidden
  ${({ open }) => (open ? "" : "opacity-0 -translate-y-4 pointer-events-none")}
`

const OptionBase = tw.div`transition ease-in-out relative py-2 px-4`
const OptionContainer = tw(OptionBase)<{
  $active?: boolean
  $selected?: boolean
}>`cursor-pointer transition ${({ $active, $selected }) =>
  $active || $selected ? "bg-green-100" : ""}`
const GuestButton = tw.button`appearance-none rounded-full p-2 flex items-center justify-center h-full overflow-hidden border border-gray-500 text-gray-500 hover:text-white hover:bg-green-500 hover:border-transparent transition ease-in-out disabled:opacity-50`

const DatePickerInput = ({ placeholder, inputRef }) => (
  <div className="relative flex w-full h-10 group" ref={inputRef}>
    <InputCore type="input" data-input placeholder={placeholder} />
    <IconContainer title="toggle" data-toggle>
      <FaCalendarAlt className="w-4 h-4" />
    </IconContainer>
  </div>
)

const InputComponent = tw(
  InputCore
)`relative flex w-full h-10 outline-none focus:outline-none`

const OptionComponent = ({
  form,
  name,
  option,
}: {
  form: BookingFormType
  name: string
  option: GuestOption
}) => (
  <OptionBase className="flex items-center justify-between">
    <div>
      <p className="text-sm font-bold text-gray-700 font-title">
        {option.label}
      </p>
      <p className="text-sm text-gray-500">{option.description}</p>
    </div>
    <div className="flex items-center justify-center gap-x-2">
      <GuestButton
        onClick={form.onPlusClick(option, name)}
        disabled={form.getIsOptionDisabled(option, "plus")}
      >
        <FaPlus className="w-3 h-3" />
      </GuestButton>
      <p className="text-sm font-bold text-gray-700 font-title">
        {option.value}
      </p>
      <GuestButton
        onClick={form.onMinusClick(option, name)}
        disabled={form.getIsOptionDisabled(option, "minus")}
      >
        <FaMinus className="w-3 h-3" />
      </GuestButton>
    </div>
  </OptionBase>
)

const GuestMenu = ({
  open,
  form,
  name,
  options,
}: {
  open: boolean
  form: BookingFormType
  name: string
  options: GuestOption
}) => (
  <Menu open={open}>
    {options.map((option: GuestOption) => (
      <OptionComponent
        key={option.name}
        form={form}
        name={name}
        option={option}
      />
    ))}
  </Menu>
)

const DatePicker = (props) => (
  <DateInput className="w-full" inputComponent={DatePickerInput} {...props} />
)

const filterAndMapCiies = (query) =>
  cities
    .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    .map((city) => ({ value: city.toLowerCase(), label: city }))

const searchPlace = async (query) =>
  new Promise((resolve, _reject) => {
    setTimeout(() => resolve(filterAndMapCiies(query)), 600)
  })

const defaultLocationOptions: LocationOption[] = cities
  .slice(0, 5)
  .map((city) => ({ value: city.toLowerCase(), label: city }))

const formSchema: FormSchema = {
  from: {
    type: "location",
    focusOnNext: "to",
    options: { defaultLocationOptions, searchPlace },
  },
  to: {
    type: "location",
    focusOnNext: "checkIn",
    options: { defaultLocationOptions, searchPlace },
  },
  checkIn: {
    type: "date",
    focusOnNext: "checkOut",
    options: {
      altInput: true,
      altFormat: "M j, Y",
      dateFormat: "Y-m-d",
      minDate: "today",
      wrap: true,
    },
  },
  checkOut: {
    type: "date",
    focusOnNext: "guests",
    options: {
      minDateFrom: "checkIn",
      altInput: true,
      altFormat: "M j, Y",
      dateFormat: "Y-m-d",
      wrap: true,
    },
  },
  guests: {
    type: "peopleCount",
    defaultValue: [
      {
        name: "adults",
        label: "Adults",
        description: "Ages 13+",
        value: 1,
        min: 0,
        max: 10,
      },
      {
        name: "children",
        label: "Children",
        description: "Ages 4-12",
        value: 0,
        min: 0,
        max: 10,
      },
      {
        name: "infants",
        label: "Infants",
        description: "Under 4 years old",
        value: 0,
        min: 0,
        max: 10,
      },
    ],
  },
}

interface FancyButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  isLoading?: boolean
}

const ButtonComp = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ isLoading, ...props }, ref) => (
    <IconContainer ref={ref} {...props}>
      {isLoading ? (
        <FaSpinner className="w-4 h-4 animate-spin" />
      ) : (
        <FaMapMarkerAlt className="w-4 h-4" />
      )}
    </IconContainer>
  )
)

export const BookingForm = () => {
  const form = useReactBookingForm({ formSchema })

  const onBookButtonClick = () => {
    alert(`⚡️ Booked! ${JSON.stringify(form.state, null, 2)}`)
  }

  return (
    <Container>
      <InputContainer>
        <Label>{"From"}</Label>
        <LocationSelect
          form={form}
          menu={Menu}
          menuContainer={MenuContainer}
          option={OptionContainer}
          button={ButtonComp}
          inputComponent={InputComponent}
          name="from"
          emptyOption="Nothing was found :("
          placeholder="Where are you going?"
        />
      </InputContainer>
      <InputContainer>
        <Label>{"To"}</Label>
        <LocationSelect
          form={form}
          menu={Menu}
          menuContainer={MenuContainer}
          option={OptionContainer}
          button={ButtonComp}
          inputComponent={InputComponent}
          name="to"
          emptyOption="Nothing was found :("
          placeholder="Where are you going?"
        />
      </InputContainer>
      <InputContainer>
        <Label>{"Check in"}</Label>
        <DatePicker placeholder="Add date" form={form} name={"checkIn"} />
      </InputContainer>
      <InputContainer>
        <Label>{"Check out"}</Label>
        <DatePicker placeholder="Add date" form={form} name={"checkOut"} />
      </InputContainer>
      <InputContainer>
        <Label>{"Guests"}</Label>
        <GuestSelect
          form={form}
          menuContainer={MenuContainer}
          menu={GuestMenu}
          inputComponent={InputComponent}
          placeholder="Add guests"
          name={"guests"}
        />
      </InputContainer>
      <InputContainer>
        <MainButton onClick={onBookButtonClick}>
          <FaSearch className="w-3 h-3 text-white" />
          <ButtonText>{"Search"}</ButtonText>
        </MainButton>
      </InputContainer>
    </Container>
  )
}
