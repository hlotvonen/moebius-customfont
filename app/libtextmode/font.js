const {
  white,
  bright_white,
  get_rgba,
  convert_ega_to_vga,
  ega
} = require("./palette");
const { create_canvas } = require("./canvas");
const { open_box } = require("../senders");
const fs = require("fs");


function load_custom_font() {
  const file = open_box({
    filters: [{ name: "Custom Font", extensions: ["f06", "f07", "f08", "f10", "f12", "f14", "f16", "f18", "f19", "f20", "f22", "f24", "f26", "f28", "f30", "f32"] }]
  });
  if (file) {
    return file[0];
  }
}

function generate_font_canvas(bitmask, height, length) {
  const { canvas, ctx, image_data } = create_canvas(8 * length, height);
  const rgba = get_rgba(convert_ega_to_vga(bright_white));
  for (let i = 0, y = 0, char = 0; i < bitmask.length; i++) {
    for (let x = 0, byte = bitmask[i]; x < 8; x++) {
      if ((byte >> x) & 1) {
        image_data.data.set(
          rgba,
          (y * canvas.width + (8 - 1 - x) + char * 8) * 4
        );
      }
    }
    if ((i + 1) % height == 0) {
      y = 0;
      char++;
    } else {
      y++;
    }
  }
  ctx.putImageData(image_data, 0, 0);
  return canvas;
}

function add_ninth_bit_to_canvas(canvas, length) {
  const { canvas: new_canvas, ctx } = create_canvas(9 * length, canvas.height);
  for (let char = 0; char < length; char++) {
    ctx.drawImage(
      canvas,
      char * 8,
      0,
      8,
      canvas.height,
      char * 9,
      0,
      8,
      canvas.height
    );
    if (char >= 0xc0 && char <= 0xdf) {
      ctx.drawImage(
        canvas,
        char * 8 + 8 - 1,
        0,
        1,
        canvas.height,
        char * 9 + 8,
        0,
        1,
        canvas.height
      );
    }
  }
  return new_canvas;
}

function coloured_glyphs(canvas, rgb) {
  const image_data = canvas
    .getContext("2d")
    .getImageData(0, 0, canvas.width, canvas.height);
  const { canvas: coloured_canvas, ctx } = create_canvas(
    canvas.width,
    canvas.height
  );
  const rgba = get_rgba(rgb);
  for (let i = 0; i < image_data.data.length; i += 4) {
    if (image_data.data[i + 3]) {
      image_data.data.set(rgba, i);
    }
  }
  ctx.putImageData(image_data, 0, 0);
  return coloured_canvas;
}

function coloured_background(font_width, height, rgb) {
  const { canvas, ctx, image_data } = create_canvas(font_width, height);
  const rgba = get_rgba(rgb);
  for (let i = 0; i < image_data.data.length; i += 4) {
    image_data.data.set(rgba, i);
  }
  ctx.putImageData(image_data, 0, 0);
  return canvas;
}

function create_coloured_glyph({
  canvas: glyphs_canvas,
  code,
  rgb,
  width,
  height
}) {
  const { canvas, ctx } = create_canvas(width, height);
  const image_data = glyphs_canvas
    .getContext("2d")
    .getImageData(code * width, 0, width, height);
  const rgba = get_rgba(rgb);
  for (let i = 0; i < image_data.data.length; i += 4) {
    if (image_data.data[i + 3]) {
      image_data.data.set(rgba, i);
    }
  }
  ctx.putImageData(image_data, 0, 0);
  return canvas;
}

function lookup_url(font_name) {
  switch (font_name) {
    case "IBM VGA":
      return "../fonts/ibm/CP437.F16";
    case "IBM VGA50":
      return "../fonts/ibm/CP437.F08";
    case "IBM VGA25G":
      return "../fonts/ibm/CP437.F19";
    case "IBM EGA":
      return "../fonts/ibm/CP437.F14";
    case "IBM EGA43":
      return "../fonts/ibm/CP437.F08";
    case "IBM VGA 437":
      return "../fonts/ibm/CP437.F16";
    case "IBM VGA50 437":
      return "../fonts/ibm/CP437.F08";
    case "IBM VGA25G 437":
      return "../fonts/ibm/CP437.F19";
    case "IBM EGA 437":
      return "../fonts/ibm/CP437.F14";
    case "IBM EGA43 437":
      return "../fonts/ibm/CP437.F08";
    case "IBM VGA 720":
      return "../fonts/ibm/CP720.F16";
    case "IBM VGA50 720":
      return "../fonts/ibm/CP720.F08";
    case "IBM VGA25G 720":
      return "../fonts/ibm/CP720.F19";
    case "IBM EGA 720":
      return "../fonts/ibm/CP720.F14";
    case "IBM EGA43 720":
      return "../fonts/ibm/CP720.F08";
    case "IBM VGA 737":
      return "../fonts/ibm/CP737.F16";
    case "IBM VGA50 737":
      return "../fonts/ibm/CP737.F08";
    case "IBM VGA25G 737":
      return "../fonts/ibm/CP737.F19";
    case "IBM EGA 737":
      return "../fonts/ibm/CP737.F14";
    case "IBM EGA43 737":
      return "../fonts/ibm/CP737.F08";
    case "IBM VGA 775":
      return "../fonts/ibm/CP775.F16";
    case "IBM VGA50 775":
      return "../fonts/ibm/CP775.F08";
    case "IBM VGA25G 775":
      return "../fonts/ibm/CP775.F19";
    case "IBM EGA 775":
      return "../fonts/ibm/CP775.F14";
    case "IBM EGA43 775":
      return "../fonts/ibm/CP775.F08";
    case "IBM VGA 819":
      return "../fonts/ibm/CP819.F16";
    case "IBM VGA50 819":
      return "../fonts/ibm/CP819.F08";
    case "IBM VGA25G 819":
      return "../fonts/ibm/CP819.F19";
    case "IBM EGA 819":
      return "../fonts/ibm/CP819.F14";
    case "IBM EGA43 819":
      return "../fonts/ibm/CP819.F08";
    case "IBM VGA 850":
      return "../fonts/ibm/CP850.F16";
    case "IBM VGA50 850":
      return "../fonts/ibm/CP850.F08";
    case "IBM VGA25G 850":
      return "../fonts/ibm/CP850.F19";
    case "IBM EGA 850":
      return "../fonts/ibm/CP850.F14";
    case "IBM EGA43 850":
      return "../fonts/ibm/CP850.F08";
    case "IBM VGA 852":
      return "../fonts/ibm/CP852.F16";
    case "IBM VGA50 852":
      return "../fonts/ibm/CP852.F08";
    case "IBM VGA25G 852":
      return "../fonts/ibm/CP852.F19";
    case "IBM EGA 852":
      return "../fonts/ibm/CP852.F14";
    case "IBM EGA43 852":
      return "../fonts/ibm/CP852.F08";
    case "IBM VGA 855":
      return "../fonts/ibm/CP855.F16";
    case "IBM VGA50 855":
      return "../fonts/ibm/CP855.F08";
    case "IBM VGA25G 855":
      return "../fonts/ibm/CP855.F19";
    case "IBM EGA 855":
      return "../fonts/ibm/CP855.F14";
    case "IBM EGA43 855":
      return "../fonts/ibm/CP855.F08";
    case "IBM VGA 857":
      return "../fonts/ibm/CP857.F16";
    case "IBM VGA50 857":
      return "../fonts/ibm/CP857.F08";
    case "IBM VGA25G 857":
      return "../fonts/ibm/CP857.F19";
    case "IBM EGA 857":
      return "../fonts/ibm/CP857.F14";
    case "IBM EGA43 857":
      return "../fonts/ibm/CP857.F08";
    case "IBM VGA 858":
      return "../fonts/ibm/CP858.F16";
    case "IBM VGA50 858":
      return "../fonts/ibm/CP858.F08";
    case "IBM VGA25G 858":
      return "../fonts/ibm/CP858.F19";
    case "IBM EGA 858":
      return "../fonts/ibm/CP858.F14";
    case "IBM EGA43 858":
      return "../fonts/ibm/CP858.F08";
    case "IBM VGA 860":
      return "../fonts/ibm/CP860.F16";
    case "IBM VGA50 860":
      return "../fonts/ibm/CP860.F08";
    case "IBM VGA25G 860":
      return "../fonts/ibm/CP860.F19";
    case "IBM EGA 860":
      return "../fonts/ibm/CP860.F14";
    case "IBM EGA43 860":
      return "../fonts/ibm/CP860.F08";
    case "IBM VGA 861":
      return "../fonts/ibm/CP861.F16";
    case "IBM VGA50 861":
      return "../fonts/ibm/CP861.F08";
    case "IBM VGA25G 861":
      return "../fonts/ibm/CP861.F19";
    case "IBM EGA 861":
      return "../fonts/ibm/CP861.F14";
    case "IBM EGA43 861":
      return "../fonts/ibm/CP861.F08";
    case "IBM VGA 862":
      return "../fonts/ibm/CP862.F16";
    case "IBM VGA50 862":
      return "../fonts/ibm/CP862.F08";
    case "IBM VGA25G 862":
      return "../fonts/ibm/CP862.F19";
    case "IBM EGA 862":
      return "../fonts/ibm/CP862.F14";
    case "IBM EGA43 862":
      return "../fonts/ibm/CP862.F08";
    case "IBM VGA 863":
      return "../fonts/ibm/CP863.F16";
    case "IBM VGA50 863":
      return "../fonts/ibm/CP863.F08";
    case "IBM VGA25G 863":
      return "../fonts/ibm/CP863.F19";
    case "IBM EGA 863":
      return "../fonts/ibm/CP863.F14";
    case "IBM EGA43 863":
      return "../fonts/ibm/CP863.F08";
    case "IBM VGA 864":
      return "../fonts/ibm/CP864.F16";
    case "IBM VGA50 864":
      return "../fonts/ibm/CP864.F08";
    case "IBM VGA25G 864":
      return "../fonts/ibm/CP864.F19";
    case "IBM EGA 864":
      return "../fonts/ibm/CP864.F14";
    case "IBM EGA43 864":
      return "../fonts/ibm/CP864.F08";
    case "IBM VGA 865":
      return "../fonts/ibm/CP865.F16";
    case "IBM VGA50 865":
      return "../fonts/ibm/CP865.F08";
    case "IBM VGA25G 865":
      return "../fonts/ibm/CP865.F19";
    case "IBM EGA 865":
      return "../fonts/ibm/CP865.F14";
    case "IBM EGA43 865":
      return "../fonts/ibm/CP865.F08";
    case "IBM VGA 866":
      return "../fonts/ibm/CP866.F16";
    case "IBM VGA50 866":
      return "../fonts/ibm/CP866.F08";
    case "IBM VGA25G 866":
      return "../fonts/ibm/CP866.F19";
    case "IBM EGA 866":
      return "../fonts/ibm/CP866.F14";
    case "IBM EGA43 866":
      return "../fonts/ibm/CP866.F08";
    case "IBM VGA 869":
      return "../fonts/ibm/CP869.F16";
    case "IBM VGA50 869":
      return "../fonts/ibm/CP869.F08";
    case "IBM VGA25G 869":
      return "../fonts/ibm/CP869.F19";
    case "IBM EGA 869":
      return "../fonts/ibm/CP869.F14";
    case "IBM EGA43 869":
      return "../fonts/ibm/CP869.F08";
    case "IBM VGA 872":
      return "../fonts/ibm/CP872.F16";
    case "IBM VGA50 872":
      return "../fonts/ibm/CP872.F08";
    case "IBM VGA25G 872":
      return "../fonts/ibm/CP872.F19";
    case "IBM EGA 872":
      return "../fonts/ibm/CP872.F14";
    case "IBM EGA43 872":
      return "../fonts/ibm/CP872.F08";
    case "IBM VGA KAM":
      return "../fonts/ibm/CP867.F16";
    case "IBM VGA50 KAM":
      return "../fonts/ibm/CP867.F08";
    case "IBM VGA25G KAM":
      return "../fonts/ibm/CP867.F19";
    case "IBM EGA KAM":
      return "../fonts/ibm/CP867.F14";
    case "IBM EGA43 KAM":
      return "../fonts/ibm/CP867.F08";
    case "IBM VGA MAZ":
      return "../fonts/ibm/CP667.F16";
    case "IBM VGA50 MAZ":
      return "../fonts/ibm/CP667.F08";
    case "IBM VGA25G MAZ":
      return "../fonts/ibm/CP667.F19";
    case "IBM EGA MAZ":
      return "../fonts/ibm/CP667.F14";
    case "IBM EGA43 MAZ":
      return "../fonts/ibm/CP667.F08";
    case "IBM VGA MIK":
      return "../fonts/ibm/CP866.F16";
    case "IBM VGA50 MIK":
      return "../fonts/ibm/CP866.F08";
    case "IBM VGA25G MIK":
      return "../fonts/ibm/CP866.F19";
    case "IBM EGA MIK":
      return "../fonts/ibm/CP866.F14";
    case "IBM EGA43 MIK":
      return "../fonts/ibm/CP866.F08";
    case "IBM VGA 667":
      return "../fonts/ibm/CP667.F16";
    case "IBM VGA50 667":
      return "../fonts/ibm/CP667.F08";
    case "IBM VGA25G 667":
      return "../fonts/ibm/CP667.F19";
    case "IBM EGA 667":
      return "../fonts/ibm/CP667.F14";
    case "IBM EGA43 667":
      return "../fonts/ibm/CP667.F08";
    case "IBM VGA 790":
      return "../fonts/ibm/CP790.F16";
    case "IBM VGA50 790":
      return "../fonts/ibm/CP790.F08";
    case "IBM VGA25G 790":
      return "../fonts/ibm/CP790.F19";
    case "IBM EGA 790":
      return "../fonts/ibm/CP790.F14";
    case "IBM EGA43 790":
      return "../fonts/ibm/CP790.F08";
    case "IBM VGA 866":
      return "../fonts/ibm/CP866.F16";
    case "IBM VGA50 866":
      return "../fonts/ibm/CP866.F08";
    case "IBM VGA25G 866":
      return "../fonts/ibm/CP866.F19";
    case "IBM EGA 866":
      return "../fonts/ibm/CP866.F14";
    case "IBM EGA43 866":
      return "../fonts/ibm/CP866.F08";
    case "IBM VGA 867":
      return "../fonts/ibm/CP867.F16";
    case "IBM VGA50 867":
      return "../fonts/ibm/CP867.F08";
    case "IBM VGA25G 867":
      return "../fonts/ibm/CP867.F19";
    case "IBM EGA 867":
      return "../fonts/ibm/CP867.F14";
    case "IBM EGA43 867":
      return "../fonts/ibm/CP867.F08";
    case "IBM VGA 895":
      return "../fonts/ibm/CP895.F16";
    case "IBM VGA50 895":
      return "../fonts/ibm/CP895.F08";
    case "IBM VGA25G 895":
      return "../fonts/ibm/CP895.F19";
    case "IBM EGA 895":
      return "../fonts/ibm/CP895.F14";
    case "IBM EGA43 895":
      return "../fonts/ibm/CP895.F08";
    case "IBM VGA 991":
      return "../fonts/ibm/CP991.F16";
    case "IBM VGA50 991":
      return "../fonts/ibm/CP991.F08";
    case "IBM VGA25G 991":
      return "../fonts/ibm/CP991.F19";
    case "IBM EGA 991":
      return "../fonts/ibm/CP991.F14";
    case "IBM EGA43 991":
      return "../fonts/ibm/CP991.F08";
    case "Amiga Topaz 1":
      return "../fonts/amiga/Topaz_a500.F16";
    case "Amiga Topaz 1+":
      return "../fonts/amiga/TopazPlus_a500.F16";
    case "Amiga Topaz 2":
      return "../fonts/amiga/Topaz_a1200.F16";
    case "Amiga Topaz 2+":
      return "../fonts/amiga/TopazPlus_a1200.F16";
    case "Amiga P0T-NOoDLE":
      return "../fonts/amiga/P0T-NOoDLE.F16";
    case "Amiga MicroKnight":
      return "../fonts/amiga/MicroKnight.F16";
    case "Amiga MicroKnight+":
      return "../fonts/amiga/MicroKnightPlus.F16";
    case "Amiga mOsOul":
      return "../fonts/amiga/mO'sOul.F16";
    case "TYPE.F24":
        return "../fonts/ultimatepack/40C-TYPE.F24";
    case "9THWAVE.F14":
        return "../fonts/ultimatepack/9THWAVE.F14";
    case "AIXOID8.F12":
        return "../fonts/ultimatepack/AIXOID8.F12";
    case "AIXOID8.F14":
        return "../fonts/ultimatepack/AIXOID8.F14";
    case "AIXOID9.F16":
        return "../fonts/ultimatepack/AIXOID9.F16";
    case "AIXOID9.F20":
        return "../fonts/ultimatepack/AIXOID9.F20";
    case "2_HEBREW.F14":
        return "../fonts/ultimatepack/BIGPILE/2_HEBREW.F14";
    case "ANSIBLE.F14":
        return "../fonts/ultimatepack/BIGPILE/ANSIBLE.F14";
    case "ANSIBLE.F16":
        return "../fonts/ultimatepack/BIGPILE/ANSIBLE.F16";
    case "ANTIQUE.F14":
        return "../fonts/ultimatepack/BIGPILE/ANTIQUE.F14";
    case "APEAUS.F08":
        return "../fonts/ultimatepack/BIGPILE/APEAUS.F08";
    case "APEAUS.F14":
        return "../fonts/ultimatepack/BIGPILE/APEAUS.F14";
    case "APEAUS.F16":
        return "../fonts/ultimatepack/BIGPILE/APEAUS.F16";
    case "ARABDRFT.F14":
        return "../fonts/ultimatepack/BIGPILE/ARABDRFT.F14";
    case "ARABKUFI.F14":
        return "../fonts/ultimatepack/BIGPILE/ARABKUFI.F14";
    case "ARABNAF.F14":
        return "../fonts/ultimatepack/BIGPILE/ARABNAF.F14";
    case "ARBNASKH.F14":
        return "../fonts/ultimatepack/BIGPILE/ARBNASKH.F14";
    case "ARMENIAN.F08":
        return "../fonts/ultimatepack/BIGPILE/ARMENIAN.F08";
    case "ARMENIAN.F16":
        return "../fonts/ultimatepack/BIGPILE/ARMENIAN.F16";
    case "ART.F16":
        return "../fonts/ultimatepack/BIGPILE/ART.F16";
    case "ARTX.F16":
        return "../fonts/ultimatepack/BIGPILE/ARTX.F16";
    case "ASCII.F14":
        return "../fonts/ultimatepack/BIGPILE/ASCII.F14";
    case "BIGGER.F16":
        return "../fonts/ultimatepack/BIGPILE/BIGGER.F16";
    case "BIGSERIF.F14":
        return "../fonts/ultimatepack/BIGPILE/BIGSERIF.F14";
    case "BINARYED.F14":
        return "../fonts/ultimatepack/BIGPILE/BINARYED.F14";
    case "BLKBOARD.F16":
        return "../fonts/ultimatepack/BIGPILE/BLKBOARD.F16";
    case "BTHIN.F14":
        return "../fonts/ultimatepack/BIGPILE/BTHIN.F14";
    case "BULKY.F16":
        return "../fonts/ultimatepack/BIGPILE/BULKY.F16";
    case "BWAY2.F14":
        return "../fonts/ultimatepack/BIGPILE/BWAY2.F14";
    case "CAFE.F10":
        return "../fonts/ultimatepack/BIGPILE/CAFE/CAFE.F10";
    case "CAFE.F12":
        return "../fonts/ultimatepack/BIGPILE/CAFE/CAFE.F12";
    case "POLICE.F16":
        return "../fonts/ultimatepack/BIGPILE/CAFE/POLICE.F16";
    case "PP_ROMAN.F16":
        return "../fonts/ultimatepack/BIGPILE/CAFE/PP_ROMAN.F16";
    case "PP_SSER.F16":
        return "../fonts/ultimatepack/BIGPILE/CAFE/PP_SSER.F16";
    case "B.F14":
        return "../fonts/ultimatepack/BIGPILE/CHET/B.F14";
    case "BDECLO.F14":
        return "../fonts/ultimatepack/BIGPILE/CHET/BDECLO.F14";
    case "BHEXALL.F14":
        return "../fonts/ultimatepack/BIGPILE/CHET/BHEXALL.F14";
    case "BHEXBOX.F14":
        return "../fonts/ultimatepack/BIGPILE/CHET/BHEXBOX.F14";
    case "BHEXHI.F14":
        return "../fonts/ultimatepack/BIGPILE/CHET/BHEXHI.F14";
    case "BHEXLO.F14":
        return "../fonts/ultimatepack/BIGPILE/CHET/BHEXLO.F14";
    case "SMALCAPS.F14":
        return "../fonts/ultimatepack/BIGPILE/CHET/SMALCAPS.F14";
    case "THINCAPS.F14":
        return "../fonts/ultimatepack/BIGPILE/CHET/THINCAPS.F14";
    case "THINSCRP.F14":
        return "../fonts/ultimatepack/BIGPILE/CHET/THINSCRP.F14";
    case "CNTDOWN.F14":
        return "../fonts/ultimatepack/BIGPILE/CNTDOWN.F14";
    case "CORRODED.F16":
        return "../fonts/ultimatepack/BIGPILE/CORRODED.F16";
    case "CYRIL2.F14":
        return "../fonts/ultimatepack/BIGPILE/CYRIL2.F14";
    case "CYRILL1.F08":
        return "../fonts/ultimatepack/BIGPILE/CYRILL1.F08";
    case "CYRILL1.F14":
        return "../fonts/ultimatepack/BIGPILE/CYRILL1.F14";
    case "CYRILL1.F16":
        return "../fonts/ultimatepack/BIGPILE/CYRILL1.F16";
    case "CYRILL2.F08":
        return "../fonts/ultimatepack/BIGPILE/CYRILL2.F08";
    case "CYRILL2.F14":
        return "../fonts/ultimatepack/BIGPILE/CYRILL2.F14";
    case "CYRILL2.F16":
        return "../fonts/ultimatepack/BIGPILE/CYRILL2.F16";
    case "CYRILL3.F08":
        return "../fonts/ultimatepack/BIGPILE/CYRILL3.F08";
    case "CYRILL3.F14":
        return "../fonts/ultimatepack/BIGPILE/CYRILL3.F14";
    case "CYRILL3.F16":
        return "../fonts/ultimatepack/BIGPILE/CYRILL3.F16";
    case "CYRILLIC.F14":
        return "../fonts/ultimatepack/BIGPILE/CYRILLIC.F14";
    case "DECORATE.F16":
        return "../fonts/ultimatepack/BIGPILE/DECORATE.F16";
    case "BACKWARD.F14":
        return "../fonts/ultimatepack/BIGPILE/DFE/BACKWARD.F14";
    case "CP866.F08":
        return "../fonts/ultimatepack/BIGPILE/DFE/CP866.F08";
    case "CP866.F14":
        return "../fonts/ultimatepack/BIGPILE/DFE/CP866.F14";
    case "CP866.F16":
        return "../fonts/ultimatepack/BIGPILE/DFE/CP866.F16";
    case "ICONS.F14":
        return "../fonts/ultimatepack/BIGPILE/DFE/ICONS.F14";
    case "INVERTED.F14":
        return "../fonts/ultimatepack/BIGPILE/DFE/INVERTED.F14";
    case "ITALICS.F14":
        return "../fonts/ultimatepack/BIGPILE/DFE/ITALICS.F14";
    case "RIMROCK.F10":
        return "../fonts/ultimatepack/BIGPILE/DFE/RIMROCK.F10";
    case "RMRKBOLD.F14":
        return "../fonts/ultimatepack/BIGPILE/DFE/RMRKBOLD.F14";
    case "THINDEMO.F14":
        return "../fonts/ultimatepack/BIGPILE/DFE/THINDEMO.F14";
    case "001.F16":
        return "../fonts/ultimatepack/BIGPILE/DKY#001.F16";
    case "CP111.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP111.F08";
    case "CP111.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP111.F14";
    case "CP111.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP111.F16";
    case "CP111.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP111.F19";
    case "CP112.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP112.F08";
    case "CP112.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP112.F14";
    case "CP112.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP112.F16";
    case "CP112.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP112.F19";
    case "CP113.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP113.F08";
    case "CP113.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP113.F14";
    case "CP113.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP113.F16";
    case "CP113.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP113.F19";
    case "CP437.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP437.F08";
    case "CP437.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP437.F14";
    case "CP437.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP437.F16";
    case "CP437.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP437.F19";
    case "CP850.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP850.F08";
    case "CP850.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP850.F14";
    case "CP850.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP850.F16";
    case "CP850.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP850.F19";
    case "CP851.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP851.F08";
    case "CP851.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP851.F14";
    case "CP851.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP851.F16";
    case "CP851.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP851.F19";
    case "CP852.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP852.F08";
    case "CP852.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP852.F14";
    case "CP852.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP852.F16";
    case "CP852.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP852.F19";
    case "CP853.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP853.F08";
    case "CP853.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP853.F14";
    case "CP853.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP853.F16";
    case "CP853.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP853.F19";
    case "CP860.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP860.F08";
    case "CP860.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP860.F14";
    case "CP860.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP860.F16";
    case "CP860.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP860.F19";
    case "CP861.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP861.F08";
    case "CP861.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP861.F14";
    case "CP861.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP861.F16";
    case "CP861.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP861.F19";
    case "CP862.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP862.F08";
    case "CP862.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP862.F14";
    case "CP862.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP862.F16";
    case "CP863.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP863.F08";
    case "CP863.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP863.F14";
    case "CP863.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP863.F16";
    case "CP863.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP863.F19";
    case "CP864.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP864.F08";
    case "CP864.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP864.F14";
    case "CP864.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP864.F16";
    case "CP865.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP865.F08";
    case "CP865.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP865.F14";
    case "CP865.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP865.F16";
    case "CP865.F19":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP865.F19";
    case "CP880.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP880.F08";
    case "CP880.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP880.F14";
    case "CP880.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP880.F16";
    case "CP881.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP881.F08";
    case "CP881.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP881.F14";
    case "CP881.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP881.F16";
    case "CP882.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP882.F08";
    case "CP882.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP882.F14";
    case "CP882.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP882.F16";
    case "CP883.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP883.F08";
    case "CP883.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP883.F14";
    case "CP883.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP883.F16";
    case "CP884.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP884.F08";
    case "CP884.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP884.F14";
    case "CP884.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP884.F16";
    case "CP885.F08":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP885.F08";
    case "CP885.F14":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP885.F14";
    case "CP885.F16":
        return "../fonts/ultimatepack/BIGPILE/DOSMIXED/CP885.F16";
    case "DRAW.F14":
        return "../fonts/ultimatepack/BIGPILE/DRAW.F14";
    case "DRAWHI.F14":
        return "../fonts/ultimatepack/BIGPILE/DRAWHI.F14";
    case "ALT.F08":
        return "../fonts/ultimatepack/BIGPILE/EVGA-ALT.F08";
    case "ALT.F09":
        return "../fonts/ultimatepack/BIGPILE/EVGA-ALT.F09";
    case "ALT.F10":
        return "../fonts/ultimatepack/BIGPILE/EVGA-ALT.F10";
    case "ALT.F11":
        return "../fonts/ultimatepack/BIGPILE/EVGA-ALT.F11";
    case "ALT.F12":
        return "../fonts/ultimatepack/BIGPILE/EVGA-ALT.F12";
    case "ALT.F13":
        return "../fonts/ultimatepack/BIGPILE/EVGA-ALT.F13";
    case "F0ALT.F14":
        return "../fonts/ultimatepack/BIGPILE/F0ALT.F14";
    case "32.F32":
        return "../fonts/ultimatepack/BIGPILE/FE2/32.F32";
    case "3270.F14":
        return "../fonts/ultimatepack/BIGPILE/FE2/3270.F14";
    case "8X10.F10":
        return "../fonts/ultimatepack/BIGPILE/FE2/8X10.F10";
    case "8X11SNSF.F11":
        return "../fonts/ultimatepack/BIGPILE/FE2/8X11SNSF.F11";
    case "8X14.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/8X14.F16";
    case "8X6.F06":
        return "../fonts/ultimatepack/BIGPILE/FE2/8X6.F06";
    case "8X8ITAL.F08":
        return "../fonts/ultimatepack/BIGPILE/FE2/8X8ITAL.F08";
    case "9X16SNSF.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/9X16SNSF.F16";
    case "AMBASSAD.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/AMBASSAD.F16";
    case "ANTIQUE.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/ANTIQUE.F16";
    case "APLS.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/APLS.F16";
    case "APLS10.F10":
        return "../fonts/ultimatepack/BIGPILE/FE2/APLS10.F10";
    case "APLS11.F11":
        return "../fonts/ultimatepack/BIGPILE/FE2/APLS11.F11";
    case "ASCII_HX.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/ASCII_HX.F16";
    case "BACKSLNT.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BACKSLNT.F16";
    case "BAUHAUS.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BAUHAUS.F16";
    case "BINARY.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BINARY.F16";
    case "BLOODY.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BLOODY.F16";
    case "BODONI.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BODONI.F16";
    case "BOLD0.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BOLD0.F16";
    case "BOLD1.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BOLD1.F16";
    case "BOLD2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BOLD2.F16";
    case "BOLD3.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BOLD3.F16";
    case "BOLD4.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BOLD4.F16";
    case "BOLD5.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BOLD5.F16";
    case "BRAILLE.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BRAILLE.F16";
    case "BROADWAY.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BROADWAY.F16";
    case "BROADWY1.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BROADWY1.F16";
    case "BROADWY2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BROADWY2.F16";
    case "BROADWY3.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BROADWY3.F16";
    case "BRUSH.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/BRUSH.F16";
    case "CALCULAT.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/CALCULAT.F16";
    case "CIRCLE.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/CIRCLE.F16";
    case "COMPUTER.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/COMPUTER.F16";
    case "COMPUTR2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/COMPUTR2.F16";
    case "COMPUTR3.F08":
        return "../fonts/ultimatepack/BIGPILE/FE2/COMPUTR3.F08";
    case "COMPUTR3.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/COMPUTR3.F16";
    case "COURIER.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/COURIER.F16";
    case "COURIER1.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/COURIER1.F16";
    case "CYRILLI2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/CYRILLI2.F16";
    case "CYRILLI3.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/CYRILLI3.F16";
    case "CYRILLIC.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/CYRILLIC.F16";
    case "DEF_8X14.F14":
        return "../fonts/ultimatepack/BIGPILE/FE2/DEF_8X14.F14";
    case "DEF_8X16.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/DEF_8X16.F16";
    case "DEF_8X8.F08":
        return "../fonts/ultimatepack/BIGPILE/FE2/DEF_8X8.F08";
    case "ELEGANT2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/ELEGANT2.F16";
    case "ELEGANTE.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/ELEGANTE.F16";
    case "ELEGITAL.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/ELEGITAL.F16";
    case "ELERGON.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/ELERGON.F16";
    case "F0.F14":
        return "../fonts/ultimatepack/BIGPILE/FE2/F0.F14";
    case "FANTASY.F08":
        return "../fonts/ultimatepack/BIGPILE/FE2/FANTASY.F08";
    case "FE_8X14.F14":
        return "../fonts/ultimatepack/BIGPILE/FE2/FE_8X14.F14";
    case "FE_8X16.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/FE_8X16.F16";
    case "FE_8X8.F08":
        return "../fonts/ultimatepack/BIGPILE/FE2/FE_8X8.F08";
    case "FRESNO.F14":
        return "../fonts/ultimatepack/BIGPILE/FE2/FRESNO.F14";
    case "FRESNO.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/FRESNO.F16";
    case "FUTURA.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/FUTURA.F16";
    case "GAELIC.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/GAELIC.F16";
    case "GOTH_NEW.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/GOTH_NEW.F16";
    case "GOTHIC.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/GOTHIC.F16";
    case "GOTHIC2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/GOTHIC2.F16";
    case "HEBREW.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/HEBREW.F16";
    case "HIGHSEAS.F14":
        return "../fonts/ultimatepack/BIGPILE/FE2/HIGHSEAS.F14";
    case "ITALIC2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/ITALIC2.F16";
    case "ITALIC3.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/ITALIC3.F16";
    case "IVAN.F14":
        return "../fonts/ultimatepack/BIGPILE/FE2/IVAN.F14";
    case "JAP.F14":
        return "../fonts/ultimatepack/BIGPILE/FE2/JAP.F14";
    case "JULIE.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/JULIE.F16";
    case "JULIE2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/JULIE2.F16";
    case "KOOL.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/KOOL.F16";
    case "LCD.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/LCD.F16";
    case "LEGEND.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/LEGEND.F16";
    case "MERP.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/MERP.F16";
    case "MERP2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/MERP2.F16";
    case "MERP3.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/MERP3.F16";
    case "MORSE.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/MORSE.F16";
    case "NUTSO.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/NUTSO.F16";
    case "OUTLINE.F11":
        return "../fonts/ultimatepack/BIGPILE/FE2/OUTLINE.F11";
    case "PARKAVE.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/PARKAVE.F16";
    case "PEKIGORD.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/PEKIGORD.F16";
    case "PERCY.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/PERCY.F16";
    case "ROMANY.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/ROMANY.F16";
    case "RUNES.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/RUNES.F16";
    case "SCRAWL.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SCRAWL.F16";
    case "SCRIPT.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SCRIPT.F16";
    case "SCRIPT2.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SCRIPT2.F16";
    case "SCRIPT3.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SCRIPT3.F16";
    case "SCRIPT4.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SCRIPT4.F16";
    case "SERIFBIG.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SERIFBIG.F16";
    case "SIMPAGAR.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SIMPAGAR.F16";
    case "SIMPLE.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SIMPLE.F16";
    case "SMALL.F10":
        return "../fonts/ultimatepack/BIGPILE/FE2/SMALL.F10";
    case "SMEGA.F14":
        return "../fonts/ultimatepack/BIGPILE/FE2/SMEGA.F14";
    case "SMEGA88.F08":
        return "../fonts/ultimatepack/BIGPILE/FE2/SMEGA88.F08";
    case "SMOOTH.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SMOOTH.F16";
    case "SMVGA.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/SMVGA.F16";
    case "SMVGA88.F08":
        return "../fonts/ultimatepack/BIGPILE/FE2/SMVGA88.F08";
    case "STRETCH.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/STRETCH.F16";
    case "TENGWAR.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/TENGWAR.F16";
    case "THAI.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/THAI.F16";
    case "THIN.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/THIN.F16";
    case "THIN8X8.F08":
        return "../fonts/ultimatepack/BIGPILE/FE2/THIN8X8.F08";
    case "THNSERIF.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/THNSERIF.F16";
    case "TINYTYPE.F08":
        return "../fonts/ultimatepack/BIGPILE/FE2/TINYTYPE.F08";
    case "WACKY.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/WACKY.F16";
    case "YIDDISH.F16":
        return "../fonts/ultimatepack/BIGPILE/FE2/YIDDISH.F16";
    case "FINNISH.F14":
        return "../fonts/ultimatepack/BIGPILE/FINNISH.F14";
    case "GRCKSSRF.F08":
        return "../fonts/ultimatepack/BIGPILE/GRCKSSRF.F08";
    case "GRCKSSRF.F14":
        return "../fonts/ultimatepack/BIGPILE/GRCKSSRF.F14";
    case "GRCKSSRF.F16":
        return "../fonts/ultimatepack/BIGPILE/GRCKSSRF.F16";
    case "GREEK.F14":
        return "../fonts/ultimatepack/BIGPILE/GREEK.F14";
    case "GREEK.F16":
        return "../fonts/ultimatepack/BIGPILE/GREEK.F16";
    case "GREEK2.F14":
        return "../fonts/ultimatepack/BIGPILE/GREEK2.F14";
    case "GREEKALT.F16":
        return "../fonts/ultimatepack/BIGPILE/GREEKALT.F16";
    case "HACK4TH.F16":
        return "../fonts/ultimatepack/BIGPILE/HACK4TH.F16";
    case "HANDUGLY.F16":
        return "../fonts/ultimatepack/BIGPILE/HANDUGLY.F16";
    case "HANDWRIT.F14":
        return "../fonts/ultimatepack/BIGPILE/HANDWRIT.F14";
    case "HANDWRIT.F16":
        return "../fonts/ultimatepack/BIGPILE/HANDWRIT.F16";
    case "7BIT.F16":
        return "../fonts/ultimatepack/BIGPILE/HEB-7BIT.F16";
    case "BIG.F14":
        return "../fonts/ultimatepack/BIGPILE/HEB-BIG.F14";
    case "BOLD.F16":
        return "../fonts/ultimatepack/BIGPILE/HEB-BOLD.F16";
    case "KTAB.F14":
        return "../fonts/ultimatepack/BIGPILE/HEB-KTAB.F14";
    case "MED.F14":
        return "../fonts/ultimatepack/BIGPILE/HEB-MED.F14";
    case "SNSF.F14":
        return "../fonts/ultimatepack/BIGPILE/HEB-SNSF.F14";
    case "FONTHE.F16":
        return "../fonts/ultimatepack/BIGPILE/HEB_UTIL/FONTHE.F16";
    case "FONTHE8.F08":
        return "../fonts/ultimatepack/BIGPILE/HEB_UTIL/FONTHE8.F08";
    case "HBRW1987.F08":
        return "../fonts/ultimatepack/BIGPILE/HEB_UTIL/HBRW1987.F08";
    case "HBRW1987.F16":
        return "../fonts/ultimatepack/BIGPILE/HEB_UTIL/HBRW1987.F16";
    case "IBMCGA83.F08":
        return "../fonts/ultimatepack/BIGPILE/HEB_UTIL/IBMCGA83.F08";
    case "IBMCGA83.F16":
        return "../fonts/ultimatepack/BIGPILE/HEB_UTIL/IBMCGA83.F16";
    case "LOADHEB.F16":
        return "../fonts/ultimatepack/BIGPILE/HEB_UTIL/LOADHEB.F16";
    case "VGAHEB92.F16":
        return "../fonts/ultimatepack/BIGPILE/HEB_UTIL/VGAHEB92.F16";
    case "HEBBOLDK.F16":
        return "../fonts/ultimatepack/BIGPILE/HEBBOLDK.F16";
    case "HEBCLRGF.F14":
        return "../fonts/ultimatepack/BIGPILE/HEBCLRGF.F14";
    case "HEBIBM83.F08":
        return "../fonts/ultimatepack/BIGPILE/HEBIBM83.F08";
    case "HEBIBM83.F16":
        return "../fonts/ultimatepack/BIGPILE/HEBIBM83.F16";
    case "HEBKTAV1.F16":
        return "../fonts/ultimatepack/BIGPILE/HEBKTAV1.F16";
    case "HEBKTAV2.F16":
        return "../fonts/ultimatepack/BIGPILE/HEBKTAV2.F16";
    case "HEBLARGE.F14":
        return "../fonts/ultimatepack/BIGPILE/HEBLARGE.F14";
    case "HEBLARGE.F16":
        return "../fonts/ultimatepack/BIGPILE/HEBLARGE.F16";
    case "HEBUGLY.F16":
        return "../fonts/ultimatepack/BIGPILE/HEBUGLY.F16";
    case "HEBYOGI.F16":
        return "../fonts/ultimatepack/BIGPILE/HEBYOGI.F16";
    case "BIGSERIF.F16":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/BIGSERIF.F16";
    case "BIGSF.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/BIGSF.F14";
    case "BLCKSNSF.F10":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/BLCKSNSF.F10";
    case "BLOCK.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/BLOCK.F14";
    case "BOLD.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/BOLD.F14";
    case "BROADWAY.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/BROADWAY.F14";
    case "COMPUTER.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/COMPUTER.F14";
    case "COURIER.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/COURIER.F14";
    case "FUTURE.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/FUTURE.F14";
    case "HERCITAL.F08":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/HERCITAL.F08";
    case "HERCULES.F08":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/HERCULES.F08";
    case "HERCULES.F10":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/HERCULES.F10";
    case "HERCULES.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/HERCULES.F14";
    case "HOLLOW.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/HOLLOW.F14";
    case "HRKGREEK.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/HRKGREEK.F14";
    case "LCD.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/LCD.F14";
    case "MEDIEVAL.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/MEDIEVAL.F14";
    case "SANSERIF.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/SANSERIF.F14";
    case "SLANT.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/SLANT.F14";
    case "STANDARD.F14":
        return "../fonts/ultimatepack/BIGPILE/HERCPLUS/STANDARD.F14";
    case "HOLLOW.F16":
        return "../fonts/ultimatepack/BIGPILE/HOLLOW.F16";
    case "HUGE.F16":
        return "../fonts/ultimatepack/BIGPILE/HUGE.F16";
    case "HYLAS.F14":
        return "../fonts/ultimatepack/BIGPILE/HYLAS.F14";
    case "ARABIC.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&ARABIC.F14";
    case "EUROPE.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&EUROPE.F14";
    case "FARSI.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&FARSI.F14";
    case "GAELIC.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&GAELIC.F14";
    case "GREEK.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&GREEK.F14";
    case "HEBREW.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&HEBREW.F14";
    case "POLISH.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&POLISH.F14";
    case "RUSSIAN.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&RUSSIAN.F14";
    case "TURKISH.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&TURKISH.F14";
    case "URDU.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&URDU.F14";
    case "YUGOSLA.F14":
        return "../fonts/ultimatepack/BIGPILE/INTEXT/&YUGOSLA.F14";
    case "ISO.F14":
        return "../fonts/ultimatepack/BIGPILE/ISO.F14";
    case "ISO2.F14":
        return "../fonts/ultimatepack/BIGPILE/ISO2.F14";
    case "ISO3.F14":
        return "../fonts/ultimatepack/BIGPILE/ISO3.F14";
    case "ISO4.F14":
        return "../fonts/ultimatepack/BIGPILE/ISO4.F14";
    case "KANA.F14":
        return "../fonts/ultimatepack/BIGPILE/KANA.F14";
    case "KANA.F16":
        return "../fonts/ultimatepack/BIGPILE/KANA.F16";
    case "KEWL.F16":
        return "../fonts/ultimatepack/BIGPILE/KEWL.F16";
    case "MAC.F08":
        return "../fonts/ultimatepack/BIGPILE/MAC.F08";
    case "MACNTOSH.F14":
        return "../fonts/ultimatepack/BIGPILE/MACNTOSH.F14";
    case "MACNTOSH.F16":
        return "../fonts/ultimatepack/BIGPILE/MACNTOSH.F16";
    case "MADRID.F10":
        return "../fonts/ultimatepack/BIGPILE/MADRID.F10";
    case "MEDIEVAL.F16":
        return "../fonts/ultimatepack/BIGPILE/MEDIEVAL.F16";
    case "MODERN.F16":
        return "../fonts/ultimatepack/BIGPILE/MODERN.F16";
    case "APLS.F08":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/APLS.F08";
    case "BOXROUND.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/BOXROUND.F14";
    case "BOXROUND.F16":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/BOXROUND.F16";
    case "CNTDOWN.F16":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/CNTDOWN.F16";
    case "CP437ALT.F08":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/CP437ALT.F08";
    case "CP437BGR.F08":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/CP437BGR.F08";
    case "CYRIL_B.F08":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/CYRIL_B.F08";
    case "FRACTUR.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/FRACTUR.F14";
    case "GAELIC.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/GAELIC.F14";
    case "GEORGIAN.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/GEORGIAN.F14";
    case "LB_LARGE.F16":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/LB_LARGE.F16";
    case "LB_MISC.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/LB_MISC.F14";
    case "LB_OCR.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/LB_OCR.F14";
    case "LB_OCR.F16":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/LB_OCR.F16";
    case "LBARABIC.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/LBARABIC.F14";
    case "LBITALIC.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/LBITALIC.F14";
    case "LBITALIC.F16":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/LBITALIC.F16";
    case "LBSCRIPT.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/LBSCRIPT.F14";
    case "OLDENG.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/OLDENG.F14";
    case "PC.F24":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/PC.F24";
    case "PC_6.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/PC_6.F14";
    case "PC_7.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/PC_7.F14";
    case "PERSIAN.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/PERSIAN.F14";
    case "POLISH.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/POLISH.F14";
    case "ROM8PIX.F08":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/ROM8PIX.F08";
    case "SIDE.F10":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/SIDE.F10";
    case "THIN_SS.F08":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/THIN_SS.F08";
    case "THIN_SS.F14":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/THIN_SS.F14";
    case "THIN_SS.F16":
        return "../fonts/ultimatepack/BIGPILE/NANTOOLS/THIN_SS.F16";
    case "NORTON0.F16":
        return "../fonts/ultimatepack/BIGPILE/NORTON0.F16";
    case "NORTON1.F16":
        return "../fonts/ultimatepack/BIGPILE/NORTON1.F16";
    case "NORWAY.F14":
        return "../fonts/ultimatepack/BIGPILE/NORWAY.F14";
    case "NORWAY2.F14":
        return "../fonts/ultimatepack/BIGPILE/NORWAY2.F14";
    case "ENGL.F14":
        return "../fonts/ultimatepack/BIGPILE/OLD-ENGL.F14";
    case "ENGL.F16":
        return "../fonts/ultimatepack/BIGPILE/OLD-ENGL.F16";
    case "F.F16":
        return "../fonts/ultimatepack/BIGPILE/OLDENG-F.F16";
    case "PERSIAN.F16":
        return "../fonts/ultimatepack/BIGPILE/PERSIAN.F16";
    case "READABL7.F16":
        return "../fonts/ultimatepack/BIGPILE/READABL7.F16";
    case "READABL8.F16":
        return "../fonts/ultimatepack/BIGPILE/READABL8.F16";
    case "READABLE.F08":
        return "../fonts/ultimatepack/BIGPILE/READABLE.F08";
    case "READABLE.F10":
        return "../fonts/ultimatepack/BIGPILE/READABLE.F10";
    case "REVERSE.F14":
        return "../fonts/ultimatepack/BIGPILE/REVERSE.F14";
    case "REZPOUET.F08":
        return "../fonts/ultimatepack/BIGPILE/REZPOUET.F08";
    case "ROMAN.F14":
        return "../fonts/ultimatepack/BIGPILE/ROMAN.F14";
    case "ROMAN.F16":
        return "../fonts/ultimatepack/BIGPILE/ROMAN.F16";
    case "ROMAN3.F16":
        return "../fonts/ultimatepack/BIGPILE/ROMAN3.F16";
    case "ROTUND.F16":
        return "../fonts/ultimatepack/BIGPILE/ROTUND.F16";
    case "RUS_AR.F08":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR.F08";
    case "RUS_AR.F14":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR.F14";
    case "RUS_AR.F16":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR.F16";
    case "RUS_AR1.F08":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR1.F08";
    case "RUS_AR1.F14":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR1.F14";
    case "RUS_AR1.F16":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR1.F16";
    case "RUS_AR6.F08":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR6.F08";
    case "RUS_AR6.F14":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR6.F14";
    case "RUS_AR6.F16":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR6.F16";
    case "RUS_AR6E.F08":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR6E.F08";
    case "RUS_AR6E.F14":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR6E.F14";
    case "RUS_AR6E.F16":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_AR6E.F16";
    case "RUS_ARE.F08":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_ARE.F08";
    case "RUS_ARE.F14":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_ARE.F14";
    case "RUS_ARE.F16":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/RUS_ARE.F16";
    case "Z_RUSS.F08":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/Z_RUSS.F08";
    case "Z_RUSS.F14":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/Z_RUSS.F14";
    case "Z_RUSS.F16":
        return "../fonts/ultimatepack/BIGPILE/RU_UTIL/Z_RUSS.F16";
    case "RUNIC.F14":
        return "../fonts/ultimatepack/BIGPILE/RUNIC.F14";
    case "RUSSIAN.F08":
        return "../fonts/ultimatepack/BIGPILE/RUSSIAN.F08";
    case "RUSSIAN.F14":
        return "../fonts/ultimatepack/BIGPILE/RUSSIAN.F14";
    case "RUSSIAN.F16":
        return "../fonts/ultimatepack/BIGPILE/RUSSIAN.F16";
    case "SANSERIF.F16":
        return "../fonts/ultimatepack/BIGPILE/SANSERIF.F16";
    case "SANSERIX.F16":
        return "../fonts/ultimatepack/BIGPILE/SANSERIX.F16";
    case "SCRAWL2.F16":
        return "../fonts/ultimatepack/BIGPILE/SCRAWL2.F16";
    case "SCRWL---.F16":
        return "../fonts/ultimatepack/BIGPILE/SCRWL---.F16";
    case "SECURITY.F14":
        return "../fonts/ultimatepack/BIGPILE/SECURITY.F14";
    case "SLANT2.F14":
        return "../fonts/ultimatepack/BIGPILE/SLANT2.F14";
    case "SMCAPNUM.F14":
        return "../fonts/ultimatepack/BIGPILE/SMCAPNUM.F14";
    case "SMCAPSSQ.F13":
        return "../fonts/ultimatepack/BIGPILE/SMCAPSSQ.F13";
    case "BIT8X14.F14":
        return "../fonts/ultimatepack/BIGPILE/SPEA_GDC/BIT8X14.F14";
    case "BIT8X15.F15":
        return "../fonts/ultimatepack/BIGPILE/SPEA_GDC/BIT8X15.F15";
    case "BIT8X16.F16":
        return "../fonts/ultimatepack/BIGPILE/SPEA_GDC/BIT8X16.F16";
    case "BIT8X20.F20":
        return "../fonts/ultimatepack/BIGPILE/SPEA_GDC/BIT8X20.F20";
    case "BIT8X8.F08":
        return "../fonts/ultimatepack/BIGPILE/SPEA_GDC/BIT8X8.F08";
    case "COND8X16.F16":
        return "../fonts/ultimatepack/BIGPILE/SPEA_GDC/COND8X16.F16";
    case "CONDBIT.F16":
        return "../fonts/ultimatepack/BIGPILE/SPEA_GDC/CONDBIT.F16";
    case "SYS8X16.F16":
        return "../fonts/ultimatepack/BIGPILE/SPEA_GDC/SYS8X16.F16";
    case "SYS8X20.F20":
        return "../fonts/ultimatepack/BIGPILE/SPEA_GDC/SYS8X20.F20";
    case "SPRANTO.F14":
        return "../fonts/ultimatepack/BIGPILE/SPRANTO.F14";
    case "SPRANTO1.F16":
        return "../fonts/ultimatepack/BIGPILE/SPRANTO1.F16";
    case "SPRANTO2.F16":
        return "../fonts/ultimatepack/BIGPILE/SPRANTO2.F16";
    case "SQUARE.F12":
        return "../fonts/ultimatepack/BIGPILE/SQUARE.F12";
    case "STANDARD.F16":
        return "../fonts/ultimatepack/BIGPILE/STANDARD.F16";
    case "STRETCH.F14":
        return "../fonts/ultimatepack/BIGPILE/STRETCH.F14";
    case "SUBSUP.F16":
        return "../fonts/ultimatepack/BIGPILE/SUBSUP.F16";
    case "SUPER.F16":
        return "../fonts/ultimatepack/BIGPILE/SUPER.F16";
    case "AV.F16":
        return "../fonts/ultimatepack/BIGPILE/SWISS-AV.F16";
    case "SWISS.F16":
        return "../fonts/ultimatepack/BIGPILE/SWISS.F16";
    case "SWISSAV2.F16":
        return "../fonts/ultimatepack/BIGPILE/SWISSAV2.F16";
    case "SWISSBOX.F16":
        return "../fonts/ultimatepack/BIGPILE/SWISSBOX.F16";
    case "SWISSBX2.F16":
        return "../fonts/ultimatepack/BIGPILE/SWISSBX2.F16";
    case "MATH.F14":
        return "../fonts/ultimatepack/BIGPILE/TEX-MATH.F14";
    case "MATH.F16":
        return "../fonts/ultimatepack/BIGPILE/TEX-MATH.F16";
    case "THAI.F14":
        return "../fonts/ultimatepack/BIGPILE/THAI.F14";
    case "THINASCI.F07":
        return "../fonts/ultimatepack/BIGPILE/THINASCI.F07";
    case "2_HEBREW.F16":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/2_HEBREW.F16";
    case "BROADWAY.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/BROADWAY.F08";
    case "BROADWAY.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/BROADWAY.F09";
    case "BROADWAY.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/BROADWAY.F19";
    case "COURIER.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/COURIER.F08";
    case "COURIER.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/COURIER.F09";
    case "COURIER.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/COURIER.F19";
    case "DATA.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/DATA.F08";
    case "DATA.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/DATA.F09";
    case "DATA.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/DATA.F14";
    case "DATA.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/DATA.F19";
    case "HEBCLRGF.F16":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/HEBCLRGF.F16";
    case "NEWFONT1.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT1.F08";
    case "NEWFONT1.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT1.F09";
    case "NEWFONT1.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT1.F14";
    case "NEWFONT1.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT1.F19";
    case "NEWFONT2.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT2.F08";
    case "NEWFONT2.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT2.F09";
    case "NEWFONT2.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT2.F14";
    case "NEWFONT2.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT2.F19";
    case "NEWFONT3.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT3.F14";
    case "NEWFONT3.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/NEWFONT3.F19";
    case "OLDENGL.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/OLDENGL.F14";
    case "OLDENGL.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/OLDENGL.F19";
    case "SC.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/PC-SC.F08";
    case "SC.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/PC-SC.F09";
    case "SC.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/PC-SC.F14";
    case "SC.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/PC-SC.F19";
    case "PC.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/PC.F08";
    case "PC.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/PC.F09";
    case "PC.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/PC.F14";
    case "PC.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/PC.F19";
    case "ROMAN1.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/ROMAN1.F08";
    case "ROMAN1.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/ROMAN1.F09";
    case "ROMAN1.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/ROMAN1.F14";
    case "ROMAN1.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/ROMAN1.F19";
    case "ROMAN2.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/ROMAN2.F08";
    case "ROMAN2.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/ROMAN2.F09";
    case "ROMAN2.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/ROMAN2.F14";
    case "ROMAN2.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/ROMAN2.F19";
    case "RUNIC.F16":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/RUNIC.F16";
    case "SC.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS1-SC.F08";
    case "SC.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS1-SC.F09";
    case "SC.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS1-SC.F14";
    case "SC.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS1-SC.F19";
    case "SANS1.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS1.F08";
    case "SANS1.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS1.F09";
    case "SANS1.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS1.F14";
    case "SANS1.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS1.F19";
    case "SC.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS2-SC.F08";
    case "SC.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS2-SC.F09";
    case "SC.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS2-SC.F14";
    case "SC.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS2-SC.F19";
    case "SANS2.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS2.F08";
    case "SANS2.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS2.F09";
    case "SANS2.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS2.F14";
    case "SANS2.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS2.F19";
    case "SC.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS3-SC.F14";
    case "SC.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS3-SC.F19";
    case "SANS3.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS3.F14";
    case "SANS3.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS3.F19";
    case "SC.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS4-SC.F14";
    case "SC.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS4-SC.F19";
    case "SANS4.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS4.F14";
    case "SANS4.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SANS4.F19";
    case "SCRIPT1.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SCRIPT1.F08";
    case "SCRIPT1.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SCRIPT1.F09";
    case "SCRIPT1.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SCRIPT1.F14";
    case "SCRIPT1.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SCRIPT1.F19";
    case "SCRIPT2.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SCRIPT2.F08";
    case "SCRIPT2.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SCRIPT2.F09";
    case "SCRIPT2.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SCRIPT2.F14";
    case "SCRIPT2.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SCRIPT2.F19";
    case "SCRWL~~~.F16":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/SCRWL~~~.F16";
    case "THIN.F10":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/THIN.F10";
    case "WINDOWS.F08":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/WINDOWS.F08";
    case "WINDOWS.F09":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/WINDOWS.F09";
    case "WINDOWS.F14":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/WINDOWS.F14";
    case "WINDOWS.F19":
        return "../fonts/ultimatepack/BIGPILE/ULTRAVIS/WINDOWS.F19";
    case "ROM.F08":
        return "../fonts/ultimatepack/BIGPILE/VGA-ROM.F08";
    case "ROM.F14":
        return "../fonts/ultimatepack/BIGPILE/VGA-ROM.F14";
    case "ROM.F16":
        return "../fonts/ultimatepack/BIGPILE/VGA-ROM.F16";
    case "GREEK.F06":
        return "../fonts/ultimatepack/BIGPILE/VGAGREEK/GREEK.F06";
    case "GREEK.F07":
        return "../fonts/ultimatepack/BIGPILE/VGAGREEK/GREEK.F07";
    case "GREEK.F08":
        return "../fonts/ultimatepack/BIGPILE/VGAGREEK/GREEK.F08";
    case "SCRFONT.F10":
        return "../fonts/ultimatepack/BIGPILE/VIET/SCRFONT.F10";
    case "SCRFONT1.F10":
        return "../fonts/ultimatepack/BIGPILE/VIET/SCRFONT1.F10";
    case "SCRFONT2.F10":
        return "../fonts/ultimatepack/BIGPILE/VIET/SCRFONT2.F10";
    case "SCRFONT3.F10":
        return "../fonts/ultimatepack/BIGPILE/VIET/SCRFONT3.F10";
    case "VOYNICH.F16":
        return "../fonts/ultimatepack/BIGPILE/VOYNICH.F16";
    case "WACKY2.F16":
        return "../fonts/ultimatepack/BIGPILE/WACKY2.F16";
    case "WIGGLY.F16":
        return "../fonts/ultimatepack/BIGPILE/WIGGLY.F16";
    case "BLUETERM.F12":
        return "../fonts/ultimatepack/BLUETERM.F12";
    case "437.F16":
        return "../fonts/ultimatepack/DOSJ-437.F16";
    case "437.F19":
        return "../fonts/ultimatepack/DOSJ-437.F19";
    case "437.F16":
        return "../fonts/ultimatepack/DOSV-437.F16";
    case "EDDA9.F14":
        return "../fonts/ultimatepack/EDDA9.F14";
    case "ESCHATON.F08":
        return "../fonts/ultimatepack/ESCHATON.F08";
    case "FATSCII.F16":
        return "../fonts/ultimatepack/FATSCII.F16";
    case "437.F08":
        return "../fonts/ultimatepack/FM-T-437.F08";
    case "437.F16":
        return "../fonts/ultimatepack/FM-T-437.F16";
    case "fonts.txt":
        return "../fonts/ultimatepack/../fonts.txt";
    case "VGA.F32":
        return "../fonts/ultimatepack/HUGE-VGA.F32";
    case "INVASION.F08":
        return "../fonts/ultimatepack/INVASION.F08";
    case "NICER40C.F16":
        return "../fonts/ultimatepack/NICER40C.F16";
    case "APRICOTF.F10":
        return "../fonts/ultimatepack/NON-PC/APRICOTF.F10";
    case "APRICOTF.F16":
        return "../fonts/ultimatepack/NON-PC/APRICOTF.F16";
    case "TOWNS.F08":
        return "../fonts/ultimatepack/NON-PC/FM-TOWNS.F08";
    case "TOWNS.F16":
        return "../fonts/ultimatepack/NON-PC/FM-TOWNS.F16";
    case "KAYPRO10.F16":
        return "../fonts/ultimatepack/NON-PC/KAYPRO10.F16";
    case "KAYPROII.F10":
        return "../fonts/ultimatepack/NON-PC/KAYPROII.F10";
    case "KAYPROII.F20":
        return "../fonts/ultimatepack/NON-PC/KAYPROII.F20";
    case "MINDSET.F08":
        return "../fonts/ultimatepack/NON-PC/MINDSET.F08";
    case "NIMBUS1.F10":
        return "../fonts/ultimatepack/NON-PC/NIMBUS1.F10";
    case "NIMBUS1D.F20":
        return "../fonts/ultimatepack/NON-PC/NIMBUS1D.F20";
    case "NIMBUS2.F10":
        return "../fonts/ultimatepack/NON-PC/NIMBUS2.F10";
    case "NIMBUS2D.F20":
        return "../fonts/ultimatepack/NON-PC/NIMBUS2D.F20";
    case "A.F10":
        return "../fonts/ultimatepack/NON-PC/OTRONA-A.F10";
    case "A.F20":
        return "../fonts/ultimatepack/NON-PC/OTRONA-A.F20";
    case "RB100CRT.F20":
        return "../fonts/ultimatepack/NON-PC/RB100CRT.F20";
    case "RB100ROM.F10":
        return "../fonts/ultimatepack/NON-PC/RB100ROM.F10";
    case "RB100ROM.F20":
        return "../fonts/ultimatepack/NON-PC/RB100ROM.F20";
    case "TANDY2K1.F16":
        return "../fonts/ultimatepack/NON-PC/TANDY2K1.F16";
    case "TANDY2K2.F08":
        return "../fonts/ultimatepack/NON-PC/TANDY2K2.F08";
    case "TANDY2K2.F16":
        return "../fonts/ultimatepack/NON-PC/TANDY2K2.F16";
    case "VT220CRT.F10":
        return "../fonts/ultimatepack/NON-PC/VT220CRT.F10";
    case "VT220CRT.F20":
        return "../fonts/ultimatepack/NON-PC/VT220CRT.F20";
    case "VT220ROM.F10":
        return "../fonts/ultimatepack/NON-PC/VT220ROM.F10";
    case "VT220ROM.F20":
        return "../fonts/ultimatepack/NON-PC/VT220ROM.F20";
    case "3270PC9.F14":
        return "../fonts/ultimatepack/PC-IBM/3270PC9.F14";
    case "BIOS.F08":
        return "../fonts/ultimatepack/PC-IBM/BIOS.F08";
    case "BIOS_D.F16":
        return "../fonts/ultimatepack/PC-IBM/BIOS_D.F16";
    case "TH.F08":
        return "../fonts/ultimatepack/PC-IBM/CGA-TH.F08";
    case "TH_D.F16":
        return "../fonts/ultimatepack/PC-IBM/CGA-TH_D.F16";
    case "CGA.F08":
        return "../fonts/ultimatepack/PC-IBM/CGA.F08";
    case "CGA_D.F16":
        return "../fonts/ultimatepack/PC-IBM/CGA_D.F16";
    case "EGA8.F14":
        return "../fonts/ultimatepack/PC-IBM/EGA8.F14";
    case "EGA9.F14":
        return "../fonts/ultimatepack/PC-IBM/EGA9.F14";
    case "ISO.F16":
        return "../fonts/ultimatepack/PC-IBM/ISO.F16";
    case "MDA9.F14":
        return "../fonts/ultimatepack/PC-IBM/MDA9.F14";
    case "PCCONV.F08":
        return "../fonts/ultimatepack/PC-IBM/PCCONV.F08";
    case "PCCONV_D.F16":
        return "../fonts/ultimatepack/PC-IBM/PCCONV_D.F16";
    case "PGC.F16":
        return "../fonts/ultimatepack/PC-IBM/PGC.F16";
    case "PS2OLD8.F16":
        return "../fonts/ultimatepack/PC-IBM/PS2OLD8.F16";
    case "PS2OLD9.F16":
        return "../fonts/ultimatepack/PC-IBM/PS2OLD9.F16";
    case "PS2THIN1.F16":
        return "../fonts/ultimatepack/PC-IBM/PS2THIN1.F16";
    case "PS2THIN2.F16":
        return "../fonts/ultimatepack/PC-IBM/PS2THIN2.F16";
    case "PS2THIN3.F16":
        return "../fonts/ultimatepack/PC-IBM/PS2THIN3.F16";
    case "PS2THIN4.F16":
        return "../fonts/ultimatepack/PC-IBM/PS2THIN4.F16";
    case "VGA8.F16":
        return "../fonts/ultimatepack/PC-IBM/VGA8.F16";
    case "VGA9.F16":
        return "../fonts/ultimatepack/PC-IBM/VGA9.F16";
    case "AMIEGA8.F08":
        return "../fonts/ultimatepack/PC-OTHER/AMIEGA8.F08";
    case "AMIEGA8.F14":
        return "../fonts/ultimatepack/PC-OTHER/AMIEGA8.F14";
    case "AMIEGA8D.F16":
        return "../fonts/ultimatepack/PC-OTHER/AMIEGA8D.F16";
    case "AMIEGA9.F14":
        return "../fonts/ultimatepack/PC-OTHER/AMIEGA9.F14";
    case "EXEC.F19":
        return "../fonts/ultimatepack/PC-OTHER/AST-EXEC.F19";
    case "ATI8X14.F14":
        return "../fonts/ultimatepack/PC-OTHER/ATI8X14.F14";
    case "ATI8X16.F16":
        return "../fonts/ultimatepack/PC-OTHER/ATI8X16.F16";
    case "ATI8X8.F08":
        return "../fonts/ultimatepack/PC-OTHER/ATI8X8.F08";
    case "ATI8X8_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/ATI8X8_D.F16";
    case "ATI9X14.F14":
        return "../fonts/ultimatepack/PC-OTHER/ATI9X14.F14";
    case "ATI9X16.F16":
        return "../fonts/ultimatepack/PC-OTHER/ATI9X16.F16";
    case "ATIKRVGA.F16":
        return "../fonts/ultimatepack/PC-OTHER/ATIKRVGA.F16";
    case "ATISMLW6.F08":
        return "../fonts/ultimatepack/PC-OTHER/ATISMLW6.F08";
    case "COMPAQP3.F16":
        return "../fonts/ultimatepack/PC-OTHER/COMPAQP3.F16";
    case "COMPAQTH.F08":
        return "../fonts/ultimatepack/PC-OTHER/COMPAQTH.F08";
    case "COMPAQTH.F14":
        return "../fonts/ultimatepack/PC-OTHER/COMPAQTH.F14";
    case "COMPAQTH.F16":
        return "../fonts/ultimatepack/PC-OTHER/COMPAQTH.F16";
    case "DTK8X8.F08":
        return "../fonts/ultimatepack/PC-OTHER/DTK8X8.F08";
    case "DTK8X8_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/DTK8X8_D.F16";
    case "EAGLE1.F08":
        return "../fonts/ultimatepack/PC-OTHER/EAGLE1.F08";
    case "EAGLE1_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/EAGLE1_D.F16";
    case "EAGLE2.F08":
        return "../fonts/ultimatepack/PC-OTHER/EAGLE2.F08";
    case "EAGLE2_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/EAGLE2_D.F16";
    case "EAGLE3.F08":
        return "../fonts/ultimatepack/PC-OTHER/EAGLE3.F08";
    case "EAGLE3_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/EAGLE3_D.F16";
    case "EPSONQ1.F08":
        return "../fonts/ultimatepack/PC-OTHER/EPSONQ1.F08";
    case "EPSONQ1D.F16":
        return "../fonts/ultimatepack/PC-OTHER/EPSONQ1D.F16";
    case "EPSONQ2.F08":
        return "../fonts/ultimatepack/PC-OTHER/EPSONQ2.F08";
    case "EPSONQ2D.F16":
        return "../fonts/ultimatepack/PC-OTHER/EPSONQ2D.F16";
    case "EPSONQM9.F14":
        return "../fonts/ultimatepack/PC-OTHER/EPSONQM9.F14";
    case "ITT8X8.F08":
        return "../fonts/ultimatepack/PC-OTHER/ITT8X8.F08";
    case "ITT8X8_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/ITT8X8_D.F16";
    case "KPRO2K.F08":
        return "../fonts/ultimatepack/PC-OTHER/KPRO2K.F08";
    case "KPRO2K_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/KPRO2K_D.F16";
    case "LBPC.F08":
        return "../fonts/ultimatepack/PC-OTHER/LBPC.F08";
    case "LBPC_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/LBPC_D.F16";
    case "MBC16B.F08":
        return "../fonts/ultimatepack/PC-OTHER/MBC16B.F08";
    case "MBC16B_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/MBC16B_D.F16";
    case "PC1512A.F08":
        return "../fonts/ultimatepack/PC-OTHER/PC1512A.F08";
    case "PC1512AD.F16":
        return "../fonts/ultimatepack/PC-OTHER/PC1512AD.F16";
    case "PC1512B.F08":
        return "../fonts/ultimatepack/PC-OTHER/PC1512B.F08";
    case "PC1512BD.F16":
        return "../fonts/ultimatepack/PC-OTHER/PC1512BD.F16";
    case "PC1512C.F08":
        return "../fonts/ultimatepack/PC-OTHER/PC1512C.F08";
    case "PC1512CD.F16":
        return "../fonts/ultimatepack/PC-OTHER/PC1512CD.F16";
    case "PC6300.F16":
        return "../fonts/ultimatepack/PC-OTHER/PC6300.F16";
    case "PHXBIOS.F08":
        return "../fonts/ultimatepack/PC-OTHER/PHXBIOS.F08";
    case "PHXBIOSD.F16":
        return "../fonts/ultimatepack/PC-OTHER/PHXBIOSD.F16";
    case "PHXEGA8.F08":
        return "../fonts/ultimatepack/PC-OTHER/PHXEGA8.F08";
    case "PHXEGA8.F14":
        return "../fonts/ultimatepack/PC-OTHER/PHXEGA8.F14";
    case "PHXEGA8.F16":
        return "../fonts/ultimatepack/PC-OTHER/PHXEGA8.F16";
    case "PHXEGA8D.F16":
        return "../fonts/ultimatepack/PC-OTHER/PHXEGA8D.F16";
    case "PHXEGA9.F14":
        return "../fonts/ultimatepack/PC-OTHER/PHXEGA9.F14";
    case "M1.F14":
        return "../fonts/ultimatepack/PC-OTHER/PPC-M1.F14";
    case "M2.F14":
        return "../fonts/ultimatepack/PC-OTHER/PPC-M2.F14";
    case "M3.F14":
        return "../fonts/ultimatepack/PC-OTHER/PPC-M3.F14";
    case "M4.F14":
        return "../fonts/ultimatepack/PC-OTHER/PPC-M4.F14";
    case "PPC1.F08":
        return "../fonts/ultimatepack/PC-OTHER/PPC1.F08";
    case "PPC1_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/PPC1_D.F16";
    case "PPC2.F08":
        return "../fonts/ultimatepack/PC-OTHER/PPC2.F08";
    case "PPC2_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/PPC2_D.F16";
    case "PPC3.F08":
        return "../fonts/ultimatepack/PC-OTHER/PPC3.F08";
    case "PPC3_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/PPC3_D.F16";
    case "PPC4.F08":
        return "../fonts/ultimatepack/PC-OTHER/PPC4.F08";
    case "PPC4_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/PPC4_D.F16";
    case "SEEQUA.F08":
        return "../fonts/ultimatepack/PC-OTHER/SEEQUA.F08";
    case "SEEQUA_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/SEEQUA_D.F16";
    case "A1.F08":
        return "../fonts/ultimatepack/PC-OTHER/T3100-A1.F08";
    case "A1.F16":
        return "../fonts/ultimatepack/PC-OTHER/T3100-A1.F16";
    case "A2.F08":
        return "../fonts/ultimatepack/PC-OTHER/T3100-A2.F08";
    case "A2.F16":
        return "../fonts/ultimatepack/PC-OTHER/T3100-A2.F16";
    case "A3.F08":
        return "../fonts/ultimatepack/PC-OTHER/T3100-A3.F08";
    case "A3.F16":
        return "../fonts/ultimatepack/PC-OTHER/T3100-A3.F16";
    case "A4.F08":
        return "../fonts/ultimatepack/PC-OTHER/T3100-A4.F08";
    case "A4.F16":
        return "../fonts/ultimatepack/PC-OTHER/T3100-A4.F16";
    case "B1.F08":
        return "../fonts/ultimatepack/PC-OTHER/T3100-B1.F08";
    case "B1.F16":
        return "../fonts/ultimatepack/PC-OTHER/T3100-B1.F16";
    case "B2.F08":
        return "../fonts/ultimatepack/PC-OTHER/T3100-B2.F08";
    case "B2.F16":
        return "../fonts/ultimatepack/PC-OTHER/T3100-B2.F16";
    case "B3.F08":
        return "../fonts/ultimatepack/PC-OTHER/T3100-B3.F08";
    case "B3.F16":
        return "../fonts/ultimatepack/PC-OTHER/T3100-B3.F16";
    case "B4.F08":
        return "../fonts/ultimatepack/PC-OTHER/T3100-B4.F08";
    case "B4.F16":
        return "../fonts/ultimatepack/PC-OTHER/T3100-B4.F16";
    case "TANDY1.F08":
        return "../fonts/ultimatepack/PC-OTHER/TANDY1.F08";
    case "TANDY1.F09":
        return "../fonts/ultimatepack/PC-OTHER/TANDY1.F09";
    case "TANDY1_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/TANDY1_D.F16";
    case "TANDY1_D.F18":
        return "../fonts/ultimatepack/PC-OTHER/TANDY1_D.F18";
    case "TANDY2.F08":
        return "../fonts/ultimatepack/PC-OTHER/TANDY2.F08";
    case "TANDY2.F09":
        return "../fonts/ultimatepack/PC-OTHER/TANDY2.F09";
    case "TANDY2_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/TANDY2_D.F16";
    case "TANDY2_D.F18":
        return "../fonts/ultimatepack/PC-OTHER/TANDY2_D.F18";
    case "TANDY2M9.F14":
        return "../fonts/ultimatepack/PC-OTHER/TANDY2M9.F14";
    case "SAT.F08":
        return "../fonts/ultimatepack/PC-OTHER/TOSH-SAT.F08";
    case "SAT.F14":
        return "../fonts/ultimatepack/PC-OTHER/TOSH-SAT.F14";
    case "SAT.F16":
        return "../fonts/ultimatepack/PC-OTHER/TOSH-SAT.F16";
    case "TRID8800.F11":
        return "../fonts/ultimatepack/PC-OTHER/TRID8800.F11";
    case "TRID8X14.F14":
        return "../fonts/ultimatepack/PC-OTHER/TRID8X14.F14";
    case "TRID8X16.F16":
        return "../fonts/ultimatepack/PC-OTHER/TRID8X16.F16";
    case "TRID8X8.F08":
        return "../fonts/ultimatepack/PC-OTHER/TRID8X8.F08";
    case "TRID9X14.F14":
        return "../fonts/ultimatepack/PC-OTHER/TRID9X14.F14";
    case "TRID9X16.F16":
        return "../fonts/ultimatepack/PC-OTHER/TRID9X16.F16";
    case "VERITE.F08":
        return "../fonts/ultimatepack/PC-OTHER/VERITE.F08";
    case "VERITE.F14":
        return "../fonts/ultimatepack/PC-OTHER/VERITE.F14";
    case "VERITE.F16":
        return "../fonts/ultimatepack/PC-OTHER/VERITE.F16";
    case "VERITE_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/VERITE_D.F16";
    case "VTECH.F08":
        return "../fonts/ultimatepack/PC-OTHER/VTECH.F08";
    case "VTECH_D.F16":
        return "../fonts/ultimatepack/PC-OTHER/VTECH_D.F16";
    case "ARMSCII8.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ARMSCII8.F08";
    case "ARMSCII8.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ARMSCII8.F14";
    case "ARMSCII8.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ARMSCII8.F16";
    case "CP1251.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP1251.F08";
    case "CP1251.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP1251.F14";
    case "CP1251.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP1251.F16";
    case "CP437.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP437.F08";
    case "CP437.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP437.F14";
    case "CP437.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP437.F16";
    case "CP437_T.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP437_T.F08";
    case "CP437_T.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP437_T.F16";
    case "CP850.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP850.F08";
    case "CP850.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP850.F14";
    case "CP850.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP850.F16";
    case "CP850_T.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP850_T.F08";
    case "CP850_T.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP850_T.F16";
    case "CP865.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP865.F08";
    case "CP865.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP865.F14";
    case "CP865.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP865.F16";
    case "CP865_T.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP865_T.F08";
    case "CP865_T.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP865_T.F16";
    case "CP866.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP866.F08";
    case "CP866.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP866.F14";
    case "CP866.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP866.F16";
    case "CP866B.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP866B.F16";
    case "CP866C.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP866C.F16";
    case "CP866U.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP866U.F08";
    case "CP866U.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP866U.F14";
    case "CP866U.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/CP866U.F16";
    case "HAIK8.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/HAIK8.F08";
    case "HAIK8.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/HAIK8.F14";
    case "HAIK8.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/HAIK8.F16";
    case "ISO01.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO01.F08";
    case "ISO01.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO01.F14";
    case "ISO01.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO01.F16";
    case "ISO01_T.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO01_T.F16";
    case "ISO02.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO02.F08";
    case "ISO02.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO02.F14";
    case "ISO02.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO02.F16";
    case "ISO04.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO04.F08";
    case "ISO04.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO04.F14";
    case "ISO04.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO04.F16";
    case "ISO04_W.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO04_W.F16";
    case "ISO04V9.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO04V9.F08";
    case "ISO04V9.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO04V9.F14";
    case "ISO04V9.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO04V9.F16";
    case "ISO04V9W.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO04V9W.F16";
    case "ISO05.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO05.F08";
    case "ISO05.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO05.F14";
    case "ISO05.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO05.F16";
    case "ISO07.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO07.F08";
    case "ISO07.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO07.F14";
    case "ISO07.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO07.F16";
    case "ISO08.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO08.F08";
    case "ISO08.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO08.F14";
    case "ISO08.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO08.F16";
    case "ISO09.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO09.F16";
    case "ISO15.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO15.F08";
    case "ISO15.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO15.F14";
    case "ISO15.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO15.F16";
    case "ISO15_T.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/ISO15_T.F16";
    case "R.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/KOI8-R.F08";
    case "R.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/KOI8-R.F14";
    case "R.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/KOI8-R.F16";
    case "RB.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/KOI8-RB.F16";
    case "RC.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/KOI8-RC.F16";
    case "U.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/KOI8-U.F08";
    case "U.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/KOI8-U.F14";
    case "U.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/KOI8-U.F16";
    case "SWIS1131.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/SWIS1131.F16";
    case "SWIS1251.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/SWIS1251.F16";
    case "SWISS.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/SWISS.F08";
    case "SWISS.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/SWISS.F14";
    case "SWISS.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEBSD/SWISS.F16";
    case "CP1116.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1116.F08";
    case "CP1116.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1116.F14";
    case "CP1116.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1116.F16";
    case "CP1117.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1117.F08";
    case "CP1117.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1117.F14";
    case "CP1117.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1117.F16";
    case "CP1118.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1118.F08";
    case "CP1118.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1118.F14";
    case "CP1118.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1118.F16";
    case "CP1119.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1119.F08";
    case "CP1119.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1119.F14";
    case "CP1119.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1119.F16";
    case "CP1125.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1125.F08";
    case "CP1125.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1125.F14";
    case "CP1125.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1125.F16";
    case "CP113.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP113.F08";
    case "CP113.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP113.F14";
    case "CP113.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP113.F16";
    case "CP1131.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1131.F08";
    case "CP1131.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1131.F14";
    case "CP1131.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP1131.F16";
    case "CP30000.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30000.F08";
    case "CP30000.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30000.F14";
    case "CP30000.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30000.F16";
    case "CP30001.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30001.F08";
    case "CP30001.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30001.F14";
    case "CP30001.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30001.F16";
    case "CP30002.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30002.F08";
    case "CP30002.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30002.F14";
    case "CP30002.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30002.F16";
    case "CP30003.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30003.F08";
    case "CP30003.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30003.F14";
    case "CP30003.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30003.F16";
    case "CP30004.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30004.F08";
    case "CP30004.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30004.F14";
    case "CP30004.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30004.F16";
    case "CP30005.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30005.F08";
    case "CP30005.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30005.F14";
    case "CP30005.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30005.F16";
    case "CP30006.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30006.F08";
    case "CP30006.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30006.F14";
    case "CP30006.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30006.F16";
    case "CP30007.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30007.F08";
    case "CP30007.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30007.F14";
    case "CP30007.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30007.F16";
    case "CP30008.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30008.F08";
    case "CP30008.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30008.F14";
    case "CP30008.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30008.F16";
    case "CP30009.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30009.F08";
    case "CP30009.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30009.F14";
    case "CP30009.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30009.F16";
    case "CP30010.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30010.F08";
    case "CP30010.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30010.F14";
    case "CP30010.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30010.F16";
    case "CP30011.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30011.F08";
    case "CP30011.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30011.F14";
    case "CP30011.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30011.F16";
    case "CP30012.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30012.F08";
    case "CP30012.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30012.F14";
    case "CP30012.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30012.F16";
    case "CP30013.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30013.F08";
    case "CP30013.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30013.F14";
    case "CP30013.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30013.F16";
    case "CP30014.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30014.F08";
    case "CP30014.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30014.F14";
    case "CP30014.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30014.F16";
    case "CP30015.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30015.F08";
    case "CP30015.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30015.F14";
    case "CP30015.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30015.F16";
    case "CP30016.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30016.F08";
    case "CP30016.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30016.F14";
    case "CP30016.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30016.F16";
    case "CP30017.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30017.F08";
    case "CP30017.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30017.F14";
    case "CP30017.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30017.F16";
    case "CP30018.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30018.F08";
    case "CP30018.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30018.F14";
    case "CP30018.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30018.F16";
    case "CP30019.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30019.F08";
    case "CP30019.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30019.F14";
    case "CP30019.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30019.F16";
    case "CP30020.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30020.F08";
    case "CP30020.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30020.F14";
    case "CP30020.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30020.F16";
    case "CP30021.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30021.F08";
    case "CP30021.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30021.F14";
    case "CP30021.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30021.F16";
    case "CP30022.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30022.F08";
    case "CP30022.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30022.F14";
    case "CP30022.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30022.F16";
    case "CP30023.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30023.F08";
    case "CP30023.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30023.F14";
    case "CP30023.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30023.F16";
    case "CP30024.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30024.F08";
    case "CP30024.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30024.F14";
    case "CP30024.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30024.F16";
    case "CP30025.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30025.F08";
    case "CP30025.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30025.F14";
    case "CP30025.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30025.F16";
    case "CP30026.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30026.F08";
    case "CP30026.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30026.F14";
    case "CP30026.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30026.F16";
    case "CP30027.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30027.F08";
    case "CP30027.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30027.F14";
    case "CP30027.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30027.F16";
    case "CP30028.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30028.F08";
    case "CP30028.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30028.F14";
    case "CP30028.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30028.F16";
    case "CP30029.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30029.F08";
    case "CP30029.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30029.F14";
    case "CP30029.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30029.F16";
    case "CP30030.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30030.F08";
    case "CP30030.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30030.F14";
    case "CP30030.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30030.F16";
    case "CP30031.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30031.F08";
    case "CP30031.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30031.F14";
    case "CP30031.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30031.F16";
    case "CP30032.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30032.F08";
    case "CP30032.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30032.F14";
    case "CP30032.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30032.F16";
    case "CP30033.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30033.F08";
    case "CP30033.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30033.F14";
    case "CP30033.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30033.F16";
    case "CP30034.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30034.F08";
    case "CP30034.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30034.F14";
    case "CP30034.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30034.F16";
    case "CP30039.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30039.F08";
    case "CP30039.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30039.F14";
    case "CP30039.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30039.F16";
    case "CP30040.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30040.F08";
    case "CP30040.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30040.F14";
    case "CP30040.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP30040.F16";
    case "CP3012.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3012.F08";
    case "CP3012.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3012.F14";
    case "CP3012.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3012.F16";
    case "CP3021.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3021.F08";
    case "CP3021.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3021.F14";
    case "CP3021.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3021.F16";
    case "CP3845.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3845.F08";
    case "CP3845.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3845.F14";
    case "CP3845.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3845.F16";
    case "CP3846.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3846.F08";
    case "CP3846.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3846.F14";
    case "CP3846.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3846.F16";
    case "CP3848.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3848.F08";
    case "CP3848.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3848.F14";
    case "CP3848.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP3848.F16";
    case "CP437.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP437.F08";
    case "CP437.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP437.F14";
    case "CP437.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP437.F16";
    case "CP58152.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP58152.F08";
    case "CP58152.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP58152.F14";
    case "CP58152.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP58152.F16";
    case "CP58210.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP58210.F08";
    case "CP58210.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP58210.F14";
    case "CP58210.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP58210.F16";
    case "CP58335.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP58335.F08";
    case "CP58335.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP58335.F14";
    case "CP58335.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP58335.F16";
    case "CP59234.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP59234.F08";
    case "CP59234.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP59234.F14";
    case "CP59234.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP59234.F16";
    case "CP59829.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP59829.F08";
    case "CP59829.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP59829.F14";
    case "CP59829.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP59829.F16";
    case "CP60258.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP60258.F08";
    case "CP60258.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP60258.F14";
    case "CP60258.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP60258.F16";
    case "CP60853.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP60853.F08";
    case "CP60853.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP60853.F14";
    case "CP60853.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP60853.F16";
    case "CP62306.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP62306.F08";
    case "CP62306.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP62306.F14";
    case "CP62306.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP62306.F16";
    case "CP667.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP667.F08";
    case "CP667.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP667.F14";
    case "CP667.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP667.F16";
    case "CP668.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP668.F08";
    case "CP668.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP668.F14";
    case "CP668.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP668.F16";
    case "CP737.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP737.F08";
    case "CP737.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP737.F14";
    case "CP737.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP737.F16";
    case "CP770.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP770.F08";
    case "CP770.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP770.F14";
    case "CP770.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP770.F16";
    case "CP771.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP771.F08";
    case "CP771.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP771.F14";
    case "CP771.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP771.F16";
    case "CP772.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP772.F08";
    case "CP772.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP772.F14";
    case "CP772.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP772.F16";
    case "CP773.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP773.F08";
    case "CP773.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP773.F14";
    case "CP773.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP773.F16";
    case "CP774.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP774.F08";
    case "CP774.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP774.F14";
    case "CP774.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP774.F16";
    case "CP775.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP775.F08";
    case "CP775.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP775.F14";
    case "CP775.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP775.F16";
    case "CP777.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP777.F08";
    case "CP777.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP777.F14";
    case "CP777.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP777.F16";
    case "CP778.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP778.F08";
    case "CP778.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP778.F14";
    case "CP778.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP778.F16";
    case "CP790.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP790.F08";
    case "CP790.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP790.F14";
    case "CP790.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP790.F16";
    case "CP808.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP808.F08";
    case "CP808.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP808.F14";
    case "CP808.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP808.F16";
    case "CP848.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP848.F08";
    case "CP848.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP848.F14";
    case "CP848.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP848.F16";
    case "CP849.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP849.F08";
    case "CP849.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP849.F14";
    case "CP849.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP849.F16";
    case "CP850.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP850.F08";
    case "CP850.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP850.F14";
    case "CP850.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP850.F16";
    case "CP851.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP851.F08";
    case "CP851.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP851.F14";
    case "CP851.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP851.F16";
    case "CP852.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP852.F08";
    case "CP852.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP852.F14";
    case "CP852.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP852.F16";
    case "CP853.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP853.F08";
    case "CP853.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP853.F14";
    case "CP853.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP853.F16";
    case "CP855.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP855.F08";
    case "CP855.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP855.F14";
    case "CP855.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP855.F16";
    case "CP856.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP856.F08";
    case "CP856.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP856.F14";
    case "CP856.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP856.F16";
    case "CP857.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP857.F08";
    case "CP857.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP857.F14";
    case "CP857.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP857.F16";
    case "CP858.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP858.F08";
    case "CP858.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP858.F14";
    case "CP858.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP858.F16";
    case "CP859.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP859.F08";
    case "CP859.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP859.F14";
    case "CP859.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP859.F16";
    case "CP860.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP860.F08";
    case "CP860.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP860.F14";
    case "CP860.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP860.F16";
    case "CP861.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP861.F08";
    case "CP861.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP861.F14";
    case "CP861.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP861.F16";
    case "CP862.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP862.F08";
    case "CP862.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP862.F14";
    case "CP862.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP862.F16";
    case "CP863.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP863.F08";
    case "CP863.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP863.F14";
    case "CP863.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP863.F16";
    case "CP864.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP864.F08";
    case "CP864.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP864.F14";
    case "CP864.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP864.F16";
    case "CP865.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP865.F08";
    case "CP865.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP865.F14";
    case "CP865.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP865.F16";
    case "CP866.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP866.F08";
    case "CP866.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP866.F14";
    case "CP866.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP866.F16";
    case "CP867.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP867.F08";
    case "CP867.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP867.F14";
    case "CP867.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP867.F16";
    case "CP869.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP869.F08";
    case "CP869.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP869.F14";
    case "CP869.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP869.F16";
    case "CP872.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP872.F08";
    case "CP872.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP872.F14";
    case "CP872.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP872.F16";
    case "CP895.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP895.F08";
    case "CP895.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP895.F14";
    case "CP895.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP895.F16";
    case "CP899.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP899.F08";
    case "CP899.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP899.F14";
    case "CP899.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP899.F16";
    case "CP991.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP991.F08";
    case "CP991.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP991.F14";
    case "CP991.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIDOS30/CP991.F16";
    case "CP1124.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP1124.F08";
    case "CP1124.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP1124.F14";
    case "CP1124.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP1124.F16";
    case "CP58163.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP58163.F08";
    case "CP58163.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP58163.F14";
    case "CP58163.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP58163.F16";
    case "CP58258.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP58258.F08";
    case "CP58258.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP58258.F14";
    case "CP58258.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP58258.F16";
    case "CP58259.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP58259.F08";
    case "CP58259.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP58259.F14";
    case "CP58259.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP58259.F16";
    case "CP59187.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP59187.F08";
    case "CP59187.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP59187.F14";
    case "CP59187.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP59187.F16";
    case "CP59283.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP59283.F08";
    case "CP59283.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP59283.F14";
    case "CP59283.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP59283.F16";
    case "CP60211.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP60211.F08";
    case "CP60211.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP60211.F14";
    case "CP60211.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP60211.F16";
    case "CP61235.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP61235.F08";
    case "CP61235.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP61235.F14";
    case "CP61235.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP61235.F16";
    case "CP63283.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP63283.F08";
    case "CP63283.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP63283.F14";
    case "CP63283.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP63283.F16";
    case "CP65500.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65500.F08";
    case "CP65500.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65500.F14";
    case "CP65500.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65500.F16";
    case "CP65501.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65501.F08";
    case "CP65501.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65501.F14";
    case "CP65501.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65501.F16";
    case "CP65502.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65502.F08";
    case "CP65502.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65502.F14";
    case "CP65502.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65502.F16";
    case "CP65503.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65503.F08";
    case "CP65503.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65503.F14";
    case "CP65503.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65503.F16";
    case "CP65504.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65504.F08";
    case "CP65504.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65504.F14";
    case "CP65504.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP65504.F16";
    case "CP813.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP813.F08";
    case "CP813.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP813.F14";
    case "CP813.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP813.F16";
    case "CP819.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP819.F08";
    case "CP819.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP819.F14";
    case "CP819.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP819.F16";
    case "CP901.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP901.F08";
    case "CP901.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP901.F14";
    case "CP901.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP901.F16";
    case "CP902.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP902.F08";
    case "CP902.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP902.F14";
    case "CP902.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP902.F16";
    case "CP912.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP912.F08";
    case "CP912.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP912.F14";
    case "CP912.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP912.F16";
    case "CP913.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP913.F08";
    case "CP913.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP913.F14";
    case "CP913.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP913.F16";
    case "CP914.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP914.F08";
    case "CP914.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP914.F14";
    case "CP914.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP914.F16";
    case "CP915.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP915.F08";
    case "CP915.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP915.F14";
    case "CP915.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP915.F16";
    case "CP919.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP919.F08";
    case "CP919.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP919.F14";
    case "CP919.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP919.F16";
    case "CP920.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP920.F08";
    case "CP920.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP920.F14";
    case "CP920.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP920.F16";
    case "CP921.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP921.F08";
    case "CP921.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP921.F14";
    case "CP921.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP921.F16";
    case "CP922.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP922.F08";
    case "CP922.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP922.F14";
    case "CP922.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP922.F16";
    case "CP923.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP923.F08";
    case "CP923.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP923.F14";
    case "CP923.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIISO12/CP923.F16";
    case "CP58222.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP58222.F08";
    case "CP58222.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP58222.F14";
    case "CP58222.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP58222.F16";
    case "CP59246.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP59246.F08";
    case "CP59246.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP59246.F14";
    case "CP59246.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP59246.F16";
    case "CP60270.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP60270.F08";
    case "CP60270.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP60270.F14";
    case "CP60270.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP60270.F16";
    case "CP61294.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP61294.F08";
    case "CP61294.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP61294.F14";
    case "CP61294.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP61294.F16";
    case "CP62318.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP62318.F08";
    case "CP62318.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP62318.F14";
    case "CP62318.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP62318.F16";
    case "CP63342.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP63342.F08";
    case "CP63342.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP63342.F14";
    case "CP63342.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP63342.F16";
    case "CP878.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP878.F08";
    case "CP878.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP878.F14";
    case "CP878.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIKOI12/CP878.F16";
    case "CP1275.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1275.F08";
    case "CP1275.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1275.F14";
    case "CP1275.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1275.F16";
    case "CP1280.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1280.F08";
    case "CP1280.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1280.F14";
    case "CP1280.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1280.F16";
    case "CP1281.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1281.F08";
    case "CP1281.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1281.F14";
    case "CP1281.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1281.F16";
    case "CP1282.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1282.F08";
    case "CP1282.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1282.F14";
    case "CP1282.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1282.F16";
    case "CP1283.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1283.F08";
    case "CP1283.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1283.F14";
    case "CP1283.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1283.F16";
    case "CP1284.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1284.F08";
    case "CP1284.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1284.F14";
    case "CP1284.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1284.F16";
    case "CP1285.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1285.F08";
    case "CP1285.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1285.F14";
    case "CP1285.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1285.F16";
    case "CP1286.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1286.F08";
    case "CP1286.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1286.F14";
    case "CP1286.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP1286.F16";
    case "CP58619.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP58619.F08";
    case "CP58619.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP58619.F14";
    case "CP58619.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP58619.F16";
    case "CP58627.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP58627.F08";
    case "CP58627.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP58627.F14";
    case "CP58627.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP58627.F16";
    case "CP58630.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP58630.F08";
    case "CP58630.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP58630.F14";
    case "CP58630.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMAC12/CP58630.F16";
    case "CP1051.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP1051.F08";
    case "CP1051.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP1051.F14";
    case "CP1051.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP1051.F16";
    case "CP1287.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP1287.F08";
    case "CP1287.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP1287.F14";
    case "CP1287.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP1287.F16";
    case "CP1288.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP1288.F08";
    case "CP1288.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP1288.F14";
    case "CP1288.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP1288.F16";
    case "CP62259.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP62259.F08";
    case "CP62259.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP62259.F14";
    case "CP62259.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP62259.F16";
    case "CP65505.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP65505.F08";
    case "CP65505.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP65505.F14";
    case "CP65505.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIMSC12/CP65505.F16";
    case "CP1250.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1250.F08";
    case "CP1250.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1250.F14";
    case "CP1250.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1250.F16";
    case "CP1251.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1251.F08";
    case "CP1251.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1251.F14";
    case "CP1251.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1251.F16";
    case "CP1252.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1252.F08";
    case "CP1252.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1252.F14";
    case "CP1252.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1252.F16";
    case "CP1253.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1253.F08";
    case "CP1253.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1253.F14";
    case "CP1253.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1253.F16";
    case "CP1254.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1254.F08";
    case "CP1254.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1254.F14";
    case "CP1254.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1254.F16";
    case "CP1257.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1257.F08";
    case "CP1257.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1257.F14";
    case "CP1257.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1257.F16";
    case "CP1270.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1270.F08";
    case "CP1270.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1270.F14";
    case "CP1270.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1270.F16";
    case "CP1361.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1361.F08";
    case "CP1361.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1361.F14";
    case "CP1361.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP1361.F16";
    case "CP58595.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58595.F08";
    case "CP58595.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58595.F14";
    case "CP58595.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58595.F16";
    case "CP58596.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58596.F08";
    case "CP58596.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58596.F14";
    case "CP58596.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58596.F16";
    case "CP58598.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58598.F08";
    case "CP58598.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58598.F14";
    case "CP58598.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58598.F16";
    case "CP58601.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58601.F08";
    case "CP58601.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58601.F14";
    case "CP58601.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP58601.F16";
    case "CP59619.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP59619.F08";
    case "CP59619.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP59619.F14";
    case "CP59619.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP59619.F16";
    case "CP59620.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP59620.F08";
    case "CP59620.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP59620.F14";
    case "CP59620.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP59620.F16";
    case "CP60643.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP60643.F08";
    case "CP60643.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP60643.F14";
    case "CP60643.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP60643.F16";
    case "CP61667.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP61667.F08";
    case "CP61667.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP61667.F14";
    case "CP61667.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP61667.F16";
    case "CP62691.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP62691.F08";
    case "CP62691.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP62691.F14";
    case "CP62691.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP62691.F16";
    case "CP65506.F08":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP65506.F08";
    case "CP65506.F14":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP65506.F14";
    case "CP65506.F16":
        return "../fonts/ultimatepack/SYSTEM/FREEDOS/CPIWIN12/CP65506.F16";
    case "437_US.F08":
        return "../fonts/ultimatepack/SYSTEM/OS2/437_US.F08";
    case "437_US.F10":
        return "../fonts/ultimatepack/SYSTEM/OS2/437_US.F10";
    case "437_US.F12":
        return "../fonts/ultimatepack/SYSTEM/OS2/437_US.F12";
    case "437_US.F14":
        return "../fonts/ultimatepack/SYSTEM/OS2/437_US.F14";
    case "437_US.F16":
        return "../fonts/ultimatepack/SYSTEM/OS2/437_US.F16";
    case "437_US.F18":
        return "../fonts/ultimatepack/SYSTEM/OS2/437_US.F18";
    case "737_GRE.F08":
        return "../fonts/ultimatepack/SYSTEM/OS2/737_GRE.F08";
    case "737_GRE.F10":
        return "../fonts/ultimatepack/SYSTEM/OS2/737_GRE.F10";
    case "737_GRE.F12":
        return "../fonts/ultimatepack/SYSTEM/OS2/737_GRE.F12";
    case "737_GRE.F14":
        return "../fonts/ultimatepack/SYSTEM/OS2/737_GRE.F14";
    case "737_GRE.F16":
        return "../fonts/ultimatepack/SYSTEM/OS2/737_GRE.F16";
    case "737_GRE.F18":
        return "../fonts/ultimatepack/SYSTEM/OS2/737_GRE.F18";
    case "850_LAT1.F08":
        return "../fonts/ultimatepack/SYSTEM/OS2/850_LAT1.F08";
    case "850_LAT1.F10":
        return "../fonts/ultimatepack/SYSTEM/OS2/850_LAT1.F10";
    case "850_LAT1.F12":
        return "../fonts/ultimatepack/SYSTEM/OS2/850_LAT1.F12";
    case "850_LAT1.F14":
        return "../fonts/ultimatepack/SYSTEM/OS2/850_LAT1.F14";
    case "850_LAT1.F16":
        return "../fonts/ultimatepack/SYSTEM/OS2/850_LAT1.F16";
    case "850_LAT1.F18":
        return "../fonts/ultimatepack/SYSTEM/OS2/850_LAT1.F18";
    case "852_LAT2.F08":
        return "../fonts/ultimatepack/SYSTEM/OS2/852_LAT2.F08";
    case "852_LAT2.F10":
        return "../fonts/ultimatepack/SYSTEM/OS2/852_LAT2.F10";
    case "852_LAT2.F12":
        return "../fonts/ultimatepack/SYSTEM/OS2/852_LAT2.F12";
    case "852_LAT2.F14":
        return "../fonts/ultimatepack/SYSTEM/OS2/852_LAT2.F14";
    case "852_LAT2.F16":
        return "../fonts/ultimatepack/SYSTEM/OS2/852_LAT2.F16";
    case "852_LAT2.F18":
        return "../fonts/ultimatepack/SYSTEM/OS2/852_LAT2.F18";
    case "855_CYR.F08":
        return "../fonts/ultimatepack/SYSTEM/OS2/855_CYR.F08";
    case "855_CYR.F10":
        return "../fonts/ultimatepack/SYSTEM/OS2/855_CYR.F10";
    case "855_CYR.F12":
        return "../fonts/ultimatepack/SYSTEM/OS2/855_CYR.F12";
    case "855_CYR.F14":
        return "../fonts/ultimatepack/SYSTEM/OS2/855_CYR.F14";
    case "855_CYR.F16":
        return "../fonts/ultimatepack/SYSTEM/OS2/855_CYR.F16";
    case "855_CYR.F18":
        return "../fonts/ultimatepack/SYSTEM/OS2/855_CYR.F18";
    case "862_HEB.F08":
        return "../fonts/ultimatepack/SYSTEM/OS2/862_HEB.F08";
    case "862_HEB.F10":
        return "../fonts/ultimatepack/SYSTEM/OS2/862_HEB.F10";
    case "862_HEB.F12":
        return "../fonts/ultimatepack/SYSTEM/OS2/862_HEB.F12";
    case "862_HEB.F14":
        return "../fonts/ultimatepack/SYSTEM/OS2/862_HEB.F14";
    case "862_HEB.F16":
        return "../fonts/ultimatepack/SYSTEM/OS2/862_HEB.F16";
    case "862_HEB.F18":
        return "../fonts/ultimatepack/SYSTEM/OS2/862_HEB.F18";
    case "864_ARA.F08":
        return "../fonts/ultimatepack/SYSTEM/OS2/864_ARA.F08";
    case "864_ARA.F10":
        return "../fonts/ultimatepack/SYSTEM/OS2/864_ARA.F10";
    case "864_ARA.F12":
        return "../fonts/ultimatepack/SYSTEM/OS2/864_ARA.F12";
    case "864_ARA.F14":
        return "../fonts/ultimatepack/SYSTEM/OS2/864_ARA.F14";
    case "864_ARA.F16":
        return "../fonts/ultimatepack/SYSTEM/OS2/864_ARA.F16";
    case "864_ARA.F18":
        return "../fonts/ultimatepack/SYSTEM/OS2/864_ARA.F18";
    case "866_RUS.F08":
        return "../fonts/ultimatepack/SYSTEM/OS2/866_RUS.F08";
    case "866_RUS.F10":
        return "../fonts/ultimatepack/SYSTEM/OS2/866_RUS.F10";
    case "866_RUS.F12":
        return "../fonts/ultimatepack/SYSTEM/OS2/866_RUS.F12";
    case "866_RUS.F14":
        return "../fonts/ultimatepack/SYSTEM/OS2/866_RUS.F14";
    case "866_RUS.F16":
        return "../fonts/ultimatepack/SYSTEM/OS2/866_RUS.F16";
    case "866_RUS.F18":
        return "../fonts/ultimatepack/SYSTEM/OS2/866_RUS.F18";
    case "874_THA.F08":
        return "../fonts/ultimatepack/SYSTEM/OS2/874_THA.F08";
    case "874_THA.F10":
        return "../fonts/ultimatepack/SYSTEM/OS2/874_THA.F10";
    case "874_THA.F12":
        return "../fonts/ultimatepack/SYSTEM/OS2/874_THA.F12";
    case "874_THA.F14":
        return "../fonts/ultimatepack/SYSTEM/OS2/874_THA.F14";
    case "874_THA.F16":
        return "../fonts/ultimatepack/SYSTEM/OS2/874_THA.F16";
    case "874_THA.F18":
        return "../fonts/ultimatepack/SYSTEM/OS2/874_THA.F18";
    case "PRCHN.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CN-PRCHN.F16";
    case "PRCHN.F19":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CN-PRCHN.F19";
    case "TW437.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CN-TW437.F16";
    case "TW437.F19":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CN-TW437.F19";
    case "TWNHN.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CN-TWNHN.F16";
    case "TWNHN.F19":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CN-TWNHN.F19";
    case "CP437.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP437.F08";
    case "CP437.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP437.F14";
    case "CP437.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP437.F16";
    case "CP850.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP850.F08";
    case "CP850.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP850.F14";
    case "CP850.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP850.F16";
    case "CP852.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP852.F08";
    case "CP852.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP852.F14";
    case "CP852.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP852.F16";
    case "CP855.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP855.F08";
    case "CP855.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP855.F14";
    case "CP855.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP855.F16";
    case "CP857.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP857.F08";
    case "CP857.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP857.F14";
    case "CP857.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP857.F16";
    case "CP860.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP860.F08";
    case "CP860.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP860.F14";
    case "CP860.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP860.F16";
    case "CP861.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP861.F08";
    case "CP861.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP861.F14";
    case "CP861.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP861.F16";
    case "CP863.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP863.F08";
    case "CP863.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP863.F14";
    case "CP863.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP863.F16";
    case "CP865.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP865.F08";
    case "CP865.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP865.F14";
    case "CP865.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP865.F16";
    case "CP866.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP866.F08";
    case "CP866.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP866.F14";
    case "CP866.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP866.F16";
    case "CP869.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP869.F08";
    case "CP869.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP869.F14";
    case "CP869.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP869.F16";
    case "CP912.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP912.F08";
    case "CP912.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP912.F14";
    case "CP912.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP912.F16";
    case "CP915.F08":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP915.F08";
    case "CP915.F14":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP915.F14";
    case "CP915.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/CP915.F16";
    case "ISOCP437.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP437.F16";
    case "ISOCP850.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP850.F16";
    case "ISOCP852.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP852.F16";
    case "ISOCP855.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP855.F16";
    case "ISOCP857.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP857.F16";
    case "ISOCP860.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP860.F16";
    case "ISOCP861.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP861.F16";
    case "ISOCP863.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP863.F16";
    case "ISOCP866.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP866.F16";
    case "ISOCP869.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/ISOCP869.F16";
    case "V.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/J700C-V.F16";
    case "V.F19":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/J700C-V.F19";
    case "DOS.F16":
        return "../fonts/ultimatepack/SYSTEM/PCDOS2K/KR-DOS.F16";
    case "16.F16":
        return "../fonts/ultimatepack/UNSCII/16.F16";
    case "16_CYR.F16":
        return "../fonts/ultimatepack/UNSCII/16_CYR.F16";
    case "16_GFX.F16":
        return "../fonts/ultimatepack/UNSCII/16_GFX.F16";
    case "16_GRE.F16":
        return "../fonts/ultimatepack/UNSCII/16_GRE.F16";
    case "16_HEB.F16":
        return "../fonts/ultimatepack/UNSCII/16_HEB.F16";
    case "16_LT1.F16":
        return "../fonts/ultimatepack/UNSCII/16_LT1.F16";
    case "16_LT2.F16":
        return "../fonts/ultimatepack/UNSCII/16_LT2.F16";
    case "16_RUS.F16":
        return "../fonts/ultimatepack/UNSCII/16_RUS.F16";
    case "8.F08":
        return "../fonts/ultimatepack/UNSCII/8.F08";
    case "8_CYR.F08":
        return "../fonts/ultimatepack/UNSCII/8_CYR.F08";
    case "8_GFX.F08":
        return "../fonts/ultimatepack/UNSCII/8_GFX.F08";
    case "8_GRE.F08":
        return "../fonts/ultimatepack/UNSCII/8_GRE.F08";
    case "8_HEB.F08":
        return "../fonts/ultimatepack/UNSCII/8_HEB.F08";
    case "8_LT1.F08":
        return "../fonts/ultimatepack/UNSCII/8_LT1.F08";
    case "8_LT2.F08":
        return "../fonts/ultimatepack/UNSCII/8_LT2.F08";
    case "8_RUS.F08":
        return "../fonts/ultimatepack/UNSCII/8_RUS.F08";
    case "ALT8.F08":
        return "../fonts/ultimatepack/UNSCII/ALT8.F08";
    case "ALT8_CYR.F08":
        return "../fonts/ultimatepack/UNSCII/ALT8_CYR.F08";
    case "ALT8_GFX.F08":
        return "../fonts/ultimatepack/UNSCII/ALT8_GFX.F08";
    case "ALT8_GRE.F08":
        return "../fonts/ultimatepack/UNSCII/ALT8_GRE.F08";
    case "ALT8_HEB.F08":
        return "../fonts/ultimatepack/UNSCII/ALT8_HEB.F08";
    case "ALT8_LT1.F08":
        return "../fonts/ultimatepack/UNSCII/ALT8_LT1.F08";
    case "ALT8_LT2.F08":
        return "../fonts/ultimatepack/UNSCII/ALT8_LT2.F08";
    case "ALT8_RUS.F08":
        return "../fonts/ultimatepack/UNSCII/ALT8_RUS.F08";
    case "FANT.F08":
        return "../fonts/ultimatepack/UNSCII/FANT.F08";
    case "FANT_CYR.F08":
        return "../fonts/ultimatepack/UNSCII/FANT_CYR.F08";
    case "FANT_GFX.F08":
        return "../fonts/ultimatepack/UNSCII/FANT_GFX.F08";
    case "FANT_GRE.F08":
        return "../fonts/ultimatepack/UNSCII/FANT_GRE.F08";
    case "FANT_HEB.F08":
        return "../fonts/ultimatepack/UNSCII/FANT_HEB.F08";
    case "FANT_LT1.F08":
        return "../fonts/ultimatepack/UNSCII/FANT_LT1.F08";
    case "FANT_LT2.F08":
        return "../fonts/ultimatepack/UNSCII/FANT_LT2.F08";
    case "FANT_RUS.F08":
        return "../fonts/ultimatepack/UNSCII/FANT_RUS.F08";
    case "MCR.F08":
        return "../fonts/ultimatepack/UNSCII/MCR.F08";
    case "MCR_CYR.F08":
        return "../fonts/ultimatepack/UNSCII/MCR_CYR.F08";
    case "MCR_GFX.F08":
        return "../fonts/ultimatepack/UNSCII/MCR_GFX.F08";
    case "MCR_GRE.F08":
        return "../fonts/ultimatepack/UNSCII/MCR_GRE.F08";
    case "MCR_HEB.F08":
        return "../fonts/ultimatepack/UNSCII/MCR_HEB.F08";
    case "MCR_LT1.F08":
        return "../fonts/ultimatepack/UNSCII/MCR_LT1.F08";
    case "MCR_LT2.F08":
        return "../fonts/ultimatepack/UNSCII/MCR_LT2.F08";
    case "MCR_RUS.F08":
        return "../fonts/ultimatepack/UNSCII/MCR_RUS.F08";
    case "TALL.F16":
        return "../fonts/ultimatepack/UNSCII/TALL.F16";
    case "TALL_CYR.F16":
        return "../fonts/ultimatepack/UNSCII/TALL_CYR.F16";
    case "TALL_GFX.F16":
        return "../fonts/ultimatepack/UNSCII/TALL_GFX.F16";
    case "TALL_GRE.F16":
        return "../fonts/ultimatepack/UNSCII/TALL_GRE.F16";
    case "TALL_HEB.F16":
        return "../fonts/ultimatepack/UNSCII/TALL_HEB.F16";
    case "TALL_LT1.F16":
        return "../fonts/ultimatepack/UNSCII/TALL_LT1.F16";
    case "TALL_LT2.F16":
        return "../fonts/ultimatepack/UNSCII/TALL_LT2.F16";
    case "TALL_RUS.F16":
        return "../fonts/ultimatepack/UNSCII/TALL_RUS.F16";
    case "THIN.F08":
        return "../fonts/ultimatepack/UNSCII/THIN.F08";
    case "THIN_CYR.F08":
        return "../fonts/ultimatepack/UNSCII/THIN_CYR.F08";
    case "THIN_GFX.F08":
        return "../fonts/ultimatepack/UNSCII/THIN_GFX.F08";
    case "THIN_GRE.F08":
        return "../fonts/ultimatepack/UNSCII/THIN_GRE.F08";
    case "THIN_HEB.F08":
        return "../fonts/ultimatepack/UNSCII/THIN_HEB.F08";
    case "THIN_LT1.F08":
        return "../fonts/ultimatepack/UNSCII/THIN_LT1.F08";
    case "THIN_LT2.F08":
        return "../fonts/ultimatepack/UNSCII/THIN_LT2.F08";
    case "THIN_RUS.F08":
        return "../fonts/ultimatepack/UNSCII/THIN_RUS.F08";
    default:
      return "../fonts/ibm/CP437.F16";
  }
}

class Font {
  async load({ name = "IBM VGA", bytes, use_9px_font = true }) {
    if (name === "Custom") {
      this.name = "Custom";
      let resp = fs.readFileSync(load_custom_font(), null)
      bytes = resp;
    } if (bytes) {
      this.name = "Custom"
    } else {
      this.name = name;
      let req = new Request(lookup_url(name));
      let resp = await fetch(req);
      bytes = new Uint8Array(await resp.arrayBuffer());
    }
    const font_height = bytes.length / 256;
    if (font_height % 1 != 0) {
      throw "Error loading font.";
    }
    this.height = font_height;
    this.bitmask = bytes;
    this.width = 8;
    this.length = 256;
    this.use_9px_font = use_9px_font;
    this.canvas = generate_font_canvas(this.bitmask, this.height, this.length);
    if (this.use_9px_font) {
      this.width += 1;
      this.canvas = add_ninth_bit_to_canvas(this.canvas, this.length);
    }
    this.glyphs = this.palette.map((rgb) =>
      coloured_glyphs(this.canvas, convert_ega_to_vga(rgb))
    );
    this.backgrounds = this.palette.map((rgb) =>
      coloured_background(this.width, this.height, convert_ega_to_vga(rgb))
    );
    this.cursor = coloured_background(
      this.width,
      2,
      convert_ega_to_vga(bright_white)
    );
  }

  draw(ctx, block, x, y) {
    if (block.bg_rgb) {
      ctx.drawImage(
        coloured_background(this.width, this.height, block.bg_rgb),
        x,
        y
      );
    } else {
      ctx.drawImage(this.backgrounds[block.bg], x, y);
    }
    if (block.fg_rgb) {
      ctx.drawImage(
        create_coloured_glyph({
          canvas: this.canvas,
          code: block.code,
          rgb: block.fg_rgb,
          width: this.width,
          height: this.height
        }),
        x,
        y
      );
    } else {
      ctx.drawImage(
        this.glyphs[block.fg],
        block.code * this.width,
        0,
        this.width,
        this.height,
        x,
        y,
        this.width,
        this.height
      );
    }
  }

  draw_raw(ctx, block, x, y) {
    ctx.drawImage(
      create_coloured_glyph({
        canvas: this.canvas,
        code: block.code,
        rgb: convert_ega_to_vga(white),
        width: this.width,
        height: this.height
      }),
      x,
      y
    );
  }

  get_rgb(i) {
    return convert_ega_to_vga(this.palette[i]);
  }

  draw_bg(ctx, bg, x, y) {
    ctx.drawImage(this.backgrounds[bg], x, y);
  }

  draw_cursor(ctx, x, y) {
    ctx.drawImage(this.cursor, x, y);
  }

  constructor(palette = ega) {
    this.palette = palette;
  }
}

module.exports = { Font };
