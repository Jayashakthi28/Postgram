import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import Select from "@mui/material/Select";
import PostBox from "../components/PostBox";
import ColourPicker from "../components/ColourPicker";
import { useEffect } from "react";
import WebFont from "webfontloader";
import BadWordsFilter from "bad-words";
import CreatableSelect from "react-select/creatable";

export default function Add() {
  const [quotes, setquotes] = useState("");
  const filter = new BadWordsFilter({ replaceRegex: /[A-Za-z0-9]/g });
  const [font, setfont] = useState("pacifico");
  const [fontColor, setfontColor] = useState("white");
  const [bgColor, setbgColor] = useState("black");
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");

  useEffect(() => {
    WebFont.load({
      custom: {
        families: ["bubbler", "patrick", "righteous", "sofiasans", "pacifico"],
      },
    });
  }, []);
  const createOption = (label) => ({
    label,
    value: label,
  });
  const handleKeyDown = (event) => {
    if (!inputTag) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setTags((prev) => [...prev, createOption(inputTag)]);
        setInputTag("");
        event.preventDefault();
    }
  };
  return (
    <div className=" flex sm:flex-wrap w-full justify-center h-[calc(100vh-142.27px)] bg-gray-100 sm:bg-white fun relative">
      <div className="w-2/3 sm:w-screen flex justify-evenly flex-col">
        <div className=" flex items-center justify-evenly w-3/4 mx-auto p-3 backdrop-blur bg-white flex-wrap rounded-lg shadow-2xl">
          <FormControl sx={{ minWidth: "100px" }} className=" m-2 w-[143px]">
            <InputLabel id="font-label">Font</InputLabel>
            <Select
              label="Font"
              labelId="font-label"
              value={font}
              className=" h-[70px]"
              onChange={(e) => {
                setfont(e.target.value);
              }}
            >
              <MenuItem value={"pacifico"}>Pacifico</MenuItem>
              <MenuItem value={"righteous"}>Righteous</MenuItem>
              <MenuItem value={"sofiasans"}>Sofiasans</MenuItem>
              <MenuItem value={"patrick"}>Patrick</MenuItem>
            </Select>
          </FormControl>
          <ColourPicker
            legendName="Font Color"
            defaultValue="#ffffff"
            setValue={setfontColor}
            className=" m-2 w-[143px] h-[70px]"
          />
          <ColourPicker
            legendName="Background Color"
            defaultValue="#000000"
            setValue={setbgColor}
            className=" m-2 w-[143px] h-[70px]"
          />
        </div>
        <textarea
          placeholder="Enter the qutoes here"
          maxLength="180"
          className=" w-3/4 rounded p-1 h-[300px] mx-auto bg-white border-[2px] border-transparent resize-none scroll overflow-hidden outline-none shadow-2xl sm:my-3 font-bubbler focus:border-[2px] focus:border-purple-300"
          onInput={(e) => {
            let filterText = "";
            try {
              filterText = filter.clean(e.target.value);
            } catch (err) {
              filterText = e.target.value;
            }
            setquotes(filterText);
          }}
        ></textarea>
        <div className=" flex justify-center">
          <CreatableSelect
            isMulti
            isClearable
            menuIsOpen={false}
            placeholder="Enter the tags"
            inputValue={inputTag}
            value={tags}
            onInputChange={(newValue) => {
              if (tags.length > 3) {
                setInputTag("");
              } else {
                setInputTag(newValue);
              }
            }}
            onChange={(newValue) => setTags(newValue)}
            components={{
              DropdownIndicator: null,
            }}
            onKeyDown={handleKeyDown}
            className=" w-3/4 font-bubbler font-bold my-2 border-none outline-none shadow-2xl"
            classNames={{
              control: (state) =>
                state.isFocused
                  ? "!border-[2px] !border-purple-300 !shadow-none"
                  : "!border-[2px] !border-transparent",
            }}
          />
        </div>
      </div>
      <div className="w-1/3 sm:w-screen sm:my-2 flex items-center flex-col justify-center min-w-[420px] p-1">
        <Typography
          variant="h4"
          component="h4"
          fontWeight="600"
          className=" p-2"
        >
          Output:
        </Typography>
        <PostBox
          font={font}
          fontColor={fontColor}
          bgColor={bgColor}
          quote={quotes}
          className="shadow-2xl"
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            margin: "1rem",
          }}
          disabled={quotes.length === 0 || tags.length === 0 ? true : false}
        >
          POST
        </Button>
      </div>
    </div>
  );
}
