const electron = require("electron");
const events = new require("events");
const darwin = (process.platform == "darwin");
const menus = [];
const chat_menus = [];
const font_names = [];
const font_list = {
    "Amiga": {"Amiga Topaz 1": 16, "Amiga Topaz 1+": 16, "Amiga Topaz 2": 16, "Amiga Topaz 2+": 16, "Amiga P0T-NOoDLE": 16, "Amiga MicroKnight": 16, "Amiga MicroKnight+": 16, "Amiga mOsOul": 16},
    "Arabic": {"IBM VGA50 864": 8, "IBM EGA 864": 14, "IBM VGA 864": 16},
    "Baltic Rim": {"IBM VGA50 775": 8, "IBM EGA 775": 14, "IBM VGA 775": 16},
    "Cyrillic": {"IBM VGA50 866": 8, "IBM EGA 866": 14, "IBM VGA 866": 16, "IBM VGA50 855": 8, "IBM EGA 855": 14, "IBM VGA 855": 16},
    "French Canadian": {"IBM VGA50 863": 8, "IBM EGA 863": 14, "IBM VGA 863": 16, "IBM VGA25G 863": 19},
    "Greek": {"IBM VGA50 737": 8, "IBM EGA 737": 14, "IBM VGA 737": 16, "IBM VGA50 869": 8, "IBM EGA 869": 14, "IBM VGA 869": 16, "IBM VGA50 851": 8, "IBM EGA 851": 14, "IBM VGA 851": 16, "IBM VGA25G 851": 19},
    "Hebrew": {"IBM VGA50 862": 8, "IBM EGA 862": 14, "IBM VGA 862": 16},
    "IBM PC": {"IBM VGA50": 8, "IBM EGA": 14, "IBM VGA": 16, "IBM VGA25G": 19},
    "Icelandic": {"IBM VGA50 861": 8, "IBM EGA 861": 14, "IBM VGA 861": 16, "IBM VGA25G 861": 19},
    "Latin-1 Western European": {"IBM VGA50 850": 8, "IBM EGA 850": 14, "IBM VGA 850": 16, "IBM VGA25G 850": 19},
    "Latin-1 Central European": {"IBM VGA50 852": 8, "IBM EGA 852": 14, "IBM VGA 852": 16, "IBM VGA25G 852": 19},
    "Latin-1 Multilingual": {"IBM VGA50 853": 8, "IBM EGA 853": 14, "IBM VGA 853": 16, "IBM VGA25G 853": 19},
    "Nordic": {"IBM VGA50 865": 8, "IBM EGA 865": 14, "IBM VGA 865": 16, "IBM VGA25G 865": 19},
    "Portuguese": {"IBM VGA50 860": 8, "IBM EGA 860": 14, "IBM VGA 860": 16, "IBM VGA25G 860": 19},
    "Turkish": {"IBM VGA50 857": 8, "IBM EGA 857": 14, "IBM VGA 857": 16},
    "The Ultimate Oldschool PC Font Pack": { "40C-TYPE.F24": 24, "9THWAVE.F14": 14, "AIXOID8.F12": 12, "AIXOID8.F14": 14, "AIXOID9.F16": 16, "AIXOID9.F20": 20, "2_HEBREW.F14": 14, "ANSIBLE.F14": 14, "ANSIBLE.F16": 16, "ANTIQUE.F14": 14, "APEAUS.F08": 08, "APEAUS.F14": 14, "APEAUS.F16": 16, "ARABDRFT.F14": 14, "ARABKUFI.F14": 14, "ARABNAF.F14": 14, "ARBNASKH.F14": 14, "ARMENIAN.F08": 08, "ARMENIAN.F16": 16, "ART.F16": 16, "ARTX.F16": 16, "ASCII.F14": 14, "BIGGER.F16": 16, "BIGSERIF.F14": 14, "BINARYED.F14": 14, "BLKBOARD.F16": 16, "BTHIN.F14": 14, "BULKY.F16": 16, "BWAY2.F14": 14, "CAFE.F10": 10, "CAFE.F12": 12, "POLICE.F16": 16, "PP_ROMAN.F16": 16, "PP_SSER.F16": 16, "B.F14": 14, "BDECLO.F14": 14, "BHEXALL.F14": 14, "BHEXBOX.F14": 14, "BHEXHI.F14": 14, "BHEXLO.F14": 14, "SMALCAPS.F14": 14, "THINCAPS.F14": 14, "THINSCRP.F14": 14, "CNTDOWN.F14": 14, "CORRODED.F16": 16, "CYRIL2.F14": 14, "CYRILL1.F08": 08, "CYRILL1.F14": 14, "CYRILL1.F16": 16, "CYRILL2.F08": 08, "CYRILL2.F14": 14, "CYRILL2.F16": 16, "CYRILL3.F08": 08, "CYRILL3.F14": 14, "CYRILL3.F16": 16, "CYRILLIC.F14": 14, "DECORATE.F16": 16, "BACKWARD.F14": 14, "CP866.F08": 08, "CP866.F14": 14, "CP866.F16": 16, "ICONS.F14": 14, "INVERTED.F14": 14, "ITALICS.F14": 14, "RIMROCK.F10": 10, "RMRKBOLD.F14": 14, "THINDEMO.F14": 14, "DKY#001.F16": 16, "CP111.F08": 08, "CP111.F14": 14, "CP111.F16": 16, "CP111.F19": 19, "CP112.F08": 08, "CP112.F14": 14, "CP112.F16": 16, "CP112.F19": 19, "CP113.F08": 08, "CP113.F14": 14, "CP113.F16": 16, "CP113.F19": 19, "CP437.F08": 08, "CP437.F14": 14, "CP437.F16": 16, "CP437.F19": 19, "CP850.F08": 08, "CP850.F14": 14, "CP850.F16": 16, "CP850.F19": 19, "CP851.F08": 08, "CP851.F14": 14, "CP851.F16": 16, "CP851.F19": 19, "CP852.F08": 08, "CP852.F14": 14, "CP852.F16": 16, "CP852.F19": 19, "CP853.F08": 08, "CP853.F14": 14, "CP853.F16": 16, "CP853.F19": 19, "CP860.F08": 08, "CP860.F14": 14, "CP860.F16": 16, "CP860.F19": 19, "CP861.F08": 08, "CP861.F14": 14, "CP861.F16": 16, "CP861.F19": 19, "CP862.F08": 08, "CP862.F14": 14, "CP862.F16": 16, "CP863.F08": 08, "CP863.F14": 14, "CP863.F16": 16, "CP863.F19": 19, "CP864.F08": 08, "CP864.F14": 14, "CP864.F16": 16, "CP865.F08": 08, "CP865.F14": 14, "CP865.F16": 16, "CP865.F19": 19, "CP880.F08": 08, "CP880.F14": 14, "CP880.F16": 16, "CP881.F08": 08, "CP881.F14": 14, "CP881.F16": 16, "CP882.F08": 08, "CP882.F14": 14, "CP882.F16": 16, "CP883.F08": 08, "CP883.F14": 14, "CP883.F16": 16, "CP884.F08": 08, "CP884.F14": 14, "CP884.F16": 16, "CP885.F08": 08, "CP885.F14": 14, "CP885.F16": 16, "DRAW.F14": 14, "DRAWHI.F14": 14, "EVGA-ALT.F08": 08, "EVGA-ALT.F09": 09, "EVGA-ALT.F10": 10, "EVGA-ALT.F11": 11, "EVGA-ALT.F12": 12, "EVGA-ALT.F13": 13, "F0ALT.F14": 14, "32.F32": 32, "3270.F14": 14, "8X10.F10": 10, "8X11SNSF.F11": 11, "8X14.F16": 16, "8X6.F06": 06, "8X8ITAL.F08": 08, "9X16SNSF.F16": 16, "AMBASSAD.F16": 16, "ANTIQUE.F16": 16, "APLS.F16": 16, "APLS10.F10": 10, "APLS11.F11": 11, "ASCII_HX.F16": 16, "BACKSLNT.F16": 16, "BAUHAUS.F16": 16, "BINARY.F16": 16, "BLOODY.F16": 16, "BODONI.F16": 16, "BOLD0.F16": 16, "BOLD1.F16": 16, "BOLD2.F16": 16, "BOLD3.F16": 16, "BOLD4.F16": 16, "BOLD5.F16": 16, "BRAILLE.F16": 16, "BROADWAY.F16": 16, "BROADWY1.F16": 16, "BROADWY2.F16": 16, "BROADWY3.F16": 16, "BRUSH.F16": 16, "CALCULAT.F16": 16, "CIRCLE.F16": 16, "COMPUTER.F16": 16, "COMPUTR2.F16": 16, "COMPUTR3.F08": 08, "COMPUTR3.F16": 16, "COURIER.F16": 16, "COURIER1.F16": 16, "CYRILLI2.F16": 16, "CYRILLI3.F16": 16, "CYRILLIC.F16": 16, "DEF_8X14.F14": 14, "DEF_8X16.F16": 16, "DEF_8X8.F08": 08, "ELEGANT2.F16": 16, "ELEGANTE.F16": 16, "ELEGITAL.F16": 16, "ELERGON.F16": 16, "F0.F14": 14, "FANTASY.F08": 08, "FE_8X14.F14": 14, "FE_8X16.F16": 16, "FE_8X8.F08": 08, "FRESNO.F14": 14, "FRESNO.F16": 16, "FUTURA.F16": 16, "GAELIC.F16": 16, "GOTH_NEW.F16": 16, "GOTHIC.F16": 16, "GOTHIC2.F16": 16, "HEBREW.F16": 16, "HIGHSEAS.F14": 14, "ITALIC2.F16": 16, "ITALIC3.F16": 16, "IVAN.F14": 14, "JAP.F14": 14, "JULIE.F16": 16, "JULIE2.F16": 16, "KOOL.F16": 16, "LCD.F16": 16, "LEGEND.F16": 16, "MERP.F16": 16, "MERP2.F16": 16, "MERP3.F16": 16, "MORSE.F16": 16, "NUTSO.F16": 16, "OUTLINE.F11": 11, "PARKAVE.F16": 16, "PEKIGORD.F16": 16, "PERCY.F16": 16, "ROMANY.F16": 16, "RUNES.F16": 16, "SCRAWL.F16": 16, "SCRIPT.F16": 16, "SCRIPT2.F16": 16, "SCRIPT3.F16": 16, "SCRIPT4.F16": 16, "SERIFBIG.F16": 16, "SIMPAGAR.F16": 16, "SIMPLE.F16": 16, "SMALL.F10": 10, "SMEGA.F14": 14, "SMEGA88.F08": 08, "SMOOTH.F16": 16, "SMVGA.F16": 16, "SMVGA88.F08": 08, "STRETCH.F16": 16, "TENGWAR.F16": 16, "THAI.F16": 16, "THIN.F16": 16, "THIN8X8.F08": 08, "THNSERIF.F16": 16, "TINYTYPE.F08": 08, "WACKY.F16": 16, "YIDDISH.F16": 16, "FINNISH.F14": 14, "GRCKSSRF.F08": 08, "GRCKSSRF.F14": 14, "GRCKSSRF.F16": 16, "GREEK.F14": 14, "GREEK.F16": 16, "GREEK2.F14": 14, "GREEKALT.F16": 16, "HACK4TH.F16": 16, "HANDUGLY.F16": 16, "HANDWRIT.F14": 14, "HANDWRIT.F16": 16, "HEB-7BIT.F16": 16, "HEB-BIG.F14": 14, "HEB-BOLD.F16": 16, "HEB-KTAB.F14": 14, "HEB-MED.F14": 14, "HEB-SNSF.F14": 14, "FONTHE.F16": 16, "FONTHE8.F08": 08, "HBRW1987.F08": 08, "HBRW1987.F16": 16, "IBMCGA83.F08": 08, "IBMCGA83.F16": 16, "LOADHEB.F16": 16, "VGAHEB92.F16": 16, "HEBBOLDK.F16": 16, "HEBCLRGF.F14": 14, "HEBIBM83.F08": 08, "HEBIBM83.F16": 16, "HEBKTAV1.F16": 16, "HEBKTAV2.F16": 16, "HEBLARGE.F14": 14, "HEBLARGE.F16": 16, "HEBUGLY.F16": 16, "HEBYOGI.F16": 16, "BIGSERIF.F16": 16, "BIGSF.F14": 14, "BLCKSNSF.F10": 10, "BLOCK.F14": 14, "BOLD.F14": 14, "BROADWAY.F14": 14, "COMPUTER.F14": 14, "COURIER.F14": 14, "FUTURE.F14": 14, "HERCITAL.F08": 08, "HERCULES.F08": 08, "HERCULES.F10": 10, "HERCULES.F14": 14, "HOLLOW.F14": 14, "HRKGREEK.F14": 14, "LCD.F14": 14, "MEDIEVAL.F14": 14, "SANSERIF.F14": 14, "SLANT.F14": 14, "STANDARD.F14": 14, "HOLLOW.F16": 16, "HUGE.F16": 16, "HYLAS.F14": 14, "&ARABIC.F14": 14, "&EUROPE.F14": 14, "&FARSI.F14": 14, "&GAELIC.F14": 14, "&GREEK.F14": 14, "&HEBREW.F14": 14, "&POLISH.F14": 14, "&RUSSIAN.F14": 14, "&TURKISH.F14": 14, "&URDU.F14": 14, "&YUGOSLA.F14": 14, "ISO.F14": 14, "ISO2.F14": 14, "ISO3.F14": 14, "ISO4.F14": 14, "KANA.F14": 14, "KANA.F16": 16, "KEWL.F16": 16, "MAC.F08": 08, "MACNTOSH.F14": 14, "MACNTOSH.F16": 16, "MADRID.F10": 10, "MEDIEVAL.F16": 16, "MODERN.F16": 16, "APLS.F08": 08, "BOXROUND.F14": 14, "BOXROUND.F16": 16, "CNTDOWN.F16": 16, "CP437ALT.F08": 08, "CP437BGR.F08": 08, "CYRIL_B.F08": 08, "FRACTUR.F14": 14, "GAELIC.F14": 14, "GEORGIAN.F14": 14, "LB_LARGE.F16": 16, "LB_MISC.F14": 14, "LB_OCR.F14": 14, "LB_OCR.F16": 16, "LBARABIC.F14": 14, "LBITALIC.F14": 14, "LBITALIC.F16": 16, "LBSCRIPT.F14": 14, "OLDENG.F14": 14, "PC.F24": 24, "PC_6.F14": 14, "PC_7.F14": 14, "PERSIAN.F14": 14, "POLISH.F14": 14, "ROM8PIX.F08": 08, "SIDE.F10": 10, "THIN_SS.F08": 08, "THIN_SS.F14": 14, "THIN_SS.F16": 16, "NORTON0.F16": 16, "NORTON1.F16": 16, "NORWAY.F14": 14, "NORWAY2.F14": 14, "OLD-ENGL.F14": 14, "OLD-ENGL.F16": 16, "OLDENG-F.F16": 16, "PERSIAN.F16": 16, "READABL7.F16": 16, "READABL8.F16": 16, "READABLE.F08": 08, "READABLE.F10": 10, "REVERSE.F14": 14, "REZPOUET.F08": 08, "ROMAN.F14": 14, "ROMAN.F16": 16, "ROMAN3.F16": 16, "ROTUND.F16": 16, "RUS_AR.F08": 08, "RUS_AR.F14": 14, "RUS_AR.F16": 16, "RUS_AR1.F08": 08, "RUS_AR1.F14": 14, "RUS_AR1.F16": 16, "RUS_AR6.F08": 08, "RUS_AR6.F14": 14, "RUS_AR6.F16": 16, "RUS_AR6E.F08": 08, "RUS_AR6E.F14": 14, "RUS_AR6E.F16": 16, "RUS_ARE.F08": 08, "RUS_ARE.F14": 14, "RUS_ARE.F16": 16, "Z_RUSS.F08": 08, "Z_RUSS.F14": 14, "Z_RUSS.F16": 16, "RUNIC.F14": 14, "RUSSIAN.F08": 08, "RUSSIAN.F14": 14, "RUSSIAN.F16": 16, "SANSERIF.F16": 16, "SANSERIX.F16": 16, "SCRAWL2.F16": 16, "SCRWL---.F16": 16, "SECURITY.F14": 14, "SLANT2.F14": 14, "SMCAPNUM.F14": 14, "SMCAPSSQ.F13": 13, "BIT8X14.F14": 14, "BIT8X15.F15": 15, "BIT8X16.F16": 16, "BIT8X20.F20": 20, "BIT8X8.F08": 08, "COND8X16.F16": 16, "CONDBIT.F16": 16, "SYS8X16.F16": 16, "SYS8X20.F20": 20, "SPRANTO.F14": 14, "SPRANTO1.F16": 16, "SPRANTO2.F16": 16, "SQUARE.F12": 12, "STANDARD.F16": 16, "STRETCH.F14": 14, "SUBSUP.F16": 16, "SUPER.F16": 16, "SWISS-AV.F16": 16, "SWISS.F16": 16, "SWISSAV2.F16": 16, "SWISSBOX.F16": 16, "SWISSBX2.F16": 16, "TEX-MATH.F14": 14, "TEX-MATH.F16": 16, "THAI.F14": 14, "THINASCI.F07": 07, "2_HEBREW.F16": 16, "BROADWAY.F08": 08, "BROADWAY.F09": 09, "BROADWAY.F19": 19, "COURIER.F08": 08, "COURIER.F09": 09, "COURIER.F19": 19, "DATA.F08": 08, "DATA.F09": 09, "DATA.F14": 14, "DATA.F19": 19, "HEBCLRGF.F16": 16, "NEWFONT1.F08": 08, "NEWFONT1.F09": 09, "NEWFONT1.F14": 14, "NEWFONT1.F19": 19, "NEWFONT2.F08": 08, "NEWFONT2.F09": 09, "NEWFONT2.F14": 14, "NEWFONT2.F19": 19, "NEWFONT3.F14": 14, "NEWFONT3.F19": 19, "OLDENGL.F14": 14, "OLDENGL.F19": 19, "PC-SC.F08": 08, "PC-SC.F09": 09, "PC-SC.F14": 14, "PC-SC.F19": 19, "PC.F08": 08, "PC.F09": 09, "PC.F14": 14, "PC.F19": 19, "ROMAN1.F08": 08, "ROMAN1.F09": 09, "ROMAN1.F14": 14, "ROMAN1.F19": 19, "ROMAN2.F08": 08, "ROMAN2.F09": 09, "ROMAN2.F14": 14, "ROMAN2.F19": 19, "RUNIC.F16": 16, "SANS1-SC.F08": 08, "SANS1-SC.F09": 09, "SANS1-SC.F14": 14, "SANS1-SC.F19": 19, "SANS1.F08": 08, "SANS1.F09": 09, "SANS1.F14": 14, "SANS1.F19": 19, "SANS2-SC.F08": 08, "SANS2-SC.F09": 09, "SANS2-SC.F14": 14, "SANS2-SC.F19": 19, "SANS2.F08": 08, "SANS2.F09": 09, "SANS2.F14": 14, "SANS2.F19": 19, "SANS3-SC.F14": 14, "SANS3-SC.F19": 19, "SANS3.F14": 14, "SANS3.F19": 19, "SANS4-SC.F14": 14, "SANS4-SC.F19": 19, "SANS4.F14": 14, "SANS4.F19": 19, "SCRIPT1.F08": 08, "SCRIPT1.F09": 09, "SCRIPT1.F14": 14, "SCRIPT1.F19": 19, "SCRIPT2.F08": 08, "SCRIPT2.F09": 09, "SCRIPT2.F14": 14, "SCRIPT2.F19": 19, "SCRWL~~~.F16": 16, "THIN.F10": 10, "WINDOWS.F08": 08, "WINDOWS.F09": 09, "WINDOWS.F14": 14, "WINDOWS.F19": 19, "VGA-ROM.F08": 08, "VGA-ROM.F14": 14, "VGA-ROM.F16": 16, "GREEK.F06": 06, "GREEK.F07": 07, "GREEK.F08": 08, "SCRFONT.F10": 10, "SCRFONT1.F10": 10, "SCRFONT2.F10": 10, "SCRFONT3.F10": 10, "VOYNICH.F16": 16, "WACKY2.F16": 16, "WIGGLY.F16": 16, "BLUETERM.F12": 12, "DOSJ-437.F16": 16, "DOSJ-437.F19": 19, "DOSV-437.F16": 16, "EDDA9.F14": 14, "ESCHATON.F08": 08, "FATSCII.F16": 16, "FM-T-437.F08": 08, "FM-T-437.F16": 16, "HUGE-VGA.F32": 32, "INVASION.F08": 08, "NICER40C.F16": 16, "APRICOTF.F10": 10, "APRICOTF.F16": 16, "FM-TOWNS.F08": 08, "FM-TOWNS.F16": 16, "KAYPRO10.F16": 16, "KAYPROII.F10": 10, "KAYPROII.F20": 20, "MINDSET.F08": 08, "NIMBUS1.F10": 10, "NIMBUS1D.F20": 20, "NIMBUS2.F10": 10, "NIMBUS2D.F20": 20, "OTRONA-A.F10": 10, "OTRONA-A.F20": 20, "RB100CRT.F20": 20, "RB100ROM.F10": 10, "RB100ROM.F20": 20, "TANDY2K1.F16": 16, "TANDY2K2.F08": 08, "TANDY2K2.F16": 16, "VT220CRT.F10": 10, "VT220CRT.F20": 20, "VT220ROM.F10": 10, "VT220ROM.F20": 20, "3270PC9.F14": 14, "BIOS.F08": 08, "BIOS_D.F16": 16, "CGA-TH.F08": 08, "CGA-TH_D.F16": 16, "CGA.F08": 08, "CGA_D.F16": 16, "EGA8.F14": 14, "EGA9.F14": 14, "ISO.F16": 16, "MDA9.F14": 14, "PCCONV.F08": 08, "PCCONV_D.F16": 16, "PGC.F16": 16, "PS2OLD8.F16": 16, "PS2OLD9.F16": 16, "PS2THIN1.F16": 16, "PS2THIN2.F16": 16, "PS2THIN3.F16": 16, "PS2THIN4.F16": 16, "VGA8.F16": 16, "VGA9.F16": 16, "AMIEGA8.F08": 08, "AMIEGA8.F14": 14, "AMIEGA8D.F16": 16, "AMIEGA9.F14": 14, "AST-EXEC.F19": 19, "ATI8X14.F14": 14, "ATI8X16.F16": 16, "ATI8X8.F08": 08, "ATI8X8_D.F16": 16, "ATI9X14.F14": 14, "ATI9X16.F16": 16, "ATIKRVGA.F16": 16, "ATISMLW6.F08": 08, "COMPAQP3.F16": 16, "COMPAQTH.F08": 08, "COMPAQTH.F14": 14, "COMPAQTH.F16": 16, "DTK8X8.F08": 08, "DTK8X8_D.F16": 16, "EAGLE1.F08": 08, "EAGLE1_D.F16": 16, "EAGLE2.F08": 08, "EAGLE2_D.F16": 16, "EAGLE3.F08": 08, "EAGLE3_D.F16": 16, "EPSONQ1.F08": 08, "EPSONQ1D.F16": 16, "EPSONQ2.F08": 08, "EPSONQ2D.F16": 16, "EPSONQM9.F14": 14, "ITT8X8.F08": 08, "ITT8X8_D.F16": 16, "KPRO2K.F08": 08, "KPRO2K_D.F16": 16, "LBPC.F08": 08, "LBPC_D.F16": 16, "MBC16B.F08": 08, "MBC16B_D.F16": 16, "PC1512A.F08": 08, "PC1512AD.F16": 16, "PC1512B.F08": 08, "PC1512BD.F16": 16, "PC1512C.F08": 08, "PC1512CD.F16": 16, "PC6300.F16": 16, "PHXBIOS.F08": 08, "PHXBIOSD.F16": 16, "PHXEGA8.F08": 08, "PHXEGA8.F14": 14, "PHXEGA8.F16": 16, "PHXEGA8D.F16": 16, "PHXEGA9.F14": 14, "PPC-M1.F14": 14, "PPC-M2.F14": 14, "PPC-M3.F14": 14, "PPC-M4.F14": 14, "PPC1.F08": 08, "PPC1_D.F16": 16, "PPC2.F08": 08, "PPC2_D.F16": 16, "PPC3.F08": 08, "PPC3_D.F16": 16, "PPC4.F08": 08, "PPC4_D.F16": 16, "SEEQUA.F08": 08, "SEEQUA_D.F16": 16, "T3100-A1.F08": 08, "T3100-A1.F16": 16, "T3100-A2.F08": 08, "T3100-A2.F16": 16, "T3100-A3.F08": 08, "T3100-A3.F16": 16, "T3100-A4.F08": 08, "T3100-A4.F16": 16, "T3100-B1.F08": 08, "T3100-B1.F16": 16, "T3100-B2.F08": 08, "T3100-B2.F16": 16, "T3100-B3.F08": 08, "T3100-B3.F16": 16, "T3100-B4.F08": 08, "T3100-B4.F16": 16, "TANDY1.F08": 08, "TANDY1.F09": 09, "TANDY1_D.F16": 16, "TANDY1_D.F18": 18, "TANDY2.F08": 08, "TANDY2.F09": 09, "TANDY2_D.F16": 16, "TANDY2_D.F18": 18, "TANDY2M9.F14": 14, "TOSH-SAT.F08": 08, "TOSH-SAT.F14": 14, "TOSH-SAT.F16": 16, "TRID8800.F11": 11, "TRID8X14.F14": 14, "TRID8X16.F16": 16, "TRID8X8.F08": 08, "TRID9X14.F14": 14, "TRID9X16.F16": 16, "VERITE.F08": 08, "VERITE.F14": 14, "VERITE.F16": 16, "VERITE_D.F16": 16, "VTECH.F08": 08, "VTECH_D.F16": 16, "ARMSCII8.F08": 08, "ARMSCII8.F14": 14, "ARMSCII8.F16": 16, "CP1251.F08": 08, "CP1251.F14": 14, "CP1251.F16": 16, "CP437.F08": 08, "CP437.F14": 14, "CP437.F16": 16, "CP437_T.F08": 08, "CP437_T.F16": 16, "CP850.F08": 08, "CP850.F14": 14, "CP850.F16": 16, "CP850_T.F08": 08, "CP850_T.F16": 16, "CP865.F08": 08, "CP865.F14": 14, "CP865.F16": 16, "CP865_T.F08": 08, "CP865_T.F16": 16, "CP866.F08": 08, "CP866.F14": 14, "CP866.F16": 16, "CP866B.F16": 16, "CP866C.F16": 16, "CP866U.F08": 08, "CP866U.F14": 14, "CP866U.F16": 16, "HAIK8.F08": 08, "HAIK8.F14": 14, "HAIK8.F16": 16, "ISO01.F08": 08, "ISO01.F14": 14, "ISO01.F16": 16, "ISO01_T.F16": 16, "ISO02.F08": 08, "ISO02.F14": 14, "ISO02.F16": 16, "ISO04.F08": 08, "ISO04.F14": 14, "ISO04.F16": 16, "ISO04_W.F16": 16, "ISO04V9.F08": 08, "ISO04V9.F14": 14, "ISO04V9.F16": 16, "ISO04V9W.F16": 16, "ISO05.F08": 08, "ISO05.F14": 14, "ISO05.F16": 16, "ISO07.F08": 08, "ISO07.F14": 14, "ISO07.F16": 16, "ISO08.F08": 08, "ISO08.F14": 14, "ISO08.F16": 16, "ISO09.F16": 16, "ISO15.F08": 08, "ISO15.F14": 14, "ISO15.F16": 16, "ISO15_T.F16": 16, "KOI8-R.F08": 08, "KOI8-R.F14": 14, "KOI8-R.F16": 16, "KOI8-RB.F16": 16, "KOI8-RC.F16": 16, "KOI8-U.F08": 08, "KOI8-U.F14": 14, "KOI8-U.F16": 16, "SWIS1131.F16": 16, "SWIS1251.F16": 16, "SWISS.F08": 08, "SWISS.F14": 14, "SWISS.F16": 16, "CP1116.F08": 08, "CP1116.F14": 14, "CP1116.F16": 16, "CP1117.F08": 08, "CP1117.F14": 14, "CP1117.F16": 16, "CP1118.F08": 08, "CP1118.F14": 14, "CP1118.F16": 16, "CP1119.F08": 08, "CP1119.F14": 14, "CP1119.F16": 16, "CP1125.F08": 08, "CP1125.F14": 14, "CP1125.F16": 16, "CP113.F08": 08, "CP113.F14": 14, "CP113.F16": 16, "CP1131.F08": 08, "CP1131.F14": 14, "CP1131.F16": 16, "CP30000.F08": 08, "CP30000.F14": 14, "CP30000.F16": 16, "CP30001.F08": 08, "CP30001.F14": 14, "CP30001.F16": 16, "CP30002.F08": 08, "CP30002.F14": 14, "CP30002.F16": 16, "CP30003.F08": 08, "CP30003.F14": 14, "CP30003.F16": 16, "CP30004.F08": 08, "CP30004.F14": 14, "CP30004.F16": 16, "CP30005.F08": 08, "CP30005.F14": 14, "CP30005.F16": 16, "CP30006.F08": 08, "CP30006.F14": 14, "CP30006.F16": 16, "CP30007.F08": 08, "CP30007.F14": 14, "CP30007.F16": 16, "CP30008.F08": 08, "CP30008.F14": 14, "CP30008.F16": 16, "CP30009.F08": 08, "CP30009.F14": 14, "CP30009.F16": 16, "CP30010.F08": 08, "CP30010.F14": 14, "CP30010.F16": 16, "CP30011.F08": 08, "CP30011.F14": 14, "CP30011.F16": 16, "CP30012.F08": 08, "CP30012.F14": 14, "CP30012.F16": 16, "CP30013.F08": 08, "CP30013.F14": 14, "CP30013.F16": 16, "CP30014.F08": 08, "CP30014.F14": 14, "CP30014.F16": 16, "CP30015.F08": 08, "CP30015.F14": 14, "CP30015.F16": 16, "CP30016.F08": 08, "CP30016.F14": 14, "CP30016.F16": 16, "CP30017.F08": 08, "CP30017.F14": 14, "CP30017.F16": 16, "CP30018.F08": 08, "CP30018.F14": 14, "CP30018.F16": 16, "CP30019.F08": 08, "CP30019.F14": 14, "CP30019.F16": 16, "CP30020.F08": 08, "CP30020.F14": 14, "CP30020.F16": 16, "CP30021.F08": 08, "CP30021.F14": 14, "CP30021.F16": 16, "CP30022.F08": 08, "CP30022.F14": 14, "CP30022.F16": 16, "CP30023.F08": 08, "CP30023.F14": 14, "CP30023.F16": 16, "CP30024.F08": 08, "CP30024.F14": 14, "CP30024.F16": 16, "CP30025.F08": 08, "CP30025.F14": 14, "CP30025.F16": 16, "CP30026.F08": 08, "CP30026.F14": 14, "CP30026.F16": 16, "CP30027.F08": 08, "CP30027.F14": 14, "CP30027.F16": 16, "CP30028.F08": 08, "CP30028.F14": 14, "CP30028.F16": 16, "CP30029.F08": 08, "CP30029.F14": 14, "CP30029.F16": 16, "CP30030.F08": 08, "CP30030.F14": 14, "CP30030.F16": 16, "CP30031.F08": 08, "CP30031.F14": 14, "CP30031.F16": 16, "CP30032.F08": 08, "CP30032.F14": 14, "CP30032.F16": 16, "CP30033.F08": 08, "CP30033.F14": 14, "CP30033.F16": 16, "CP30034.F08": 08, "CP30034.F14": 14, "CP30034.F16": 16, "CP30039.F08": 08, "CP30039.F14": 14, "CP30039.F16": 16, "CP30040.F08": 08, "CP30040.F14": 14, "CP30040.F16": 16, "CP3012.F08": 08, "CP3012.F14": 14, "CP3012.F16": 16, "CP3021.F08": 08, "CP3021.F14": 14, "CP3021.F16": 16, "CP3845.F08": 08, "CP3845.F14": 14, "CP3845.F16": 16, "CP3846.F08": 08, "CP3846.F14": 14, "CP3846.F16": 16, "CP3848.F08": 08, "CP3848.F14": 14, "CP3848.F16": 16, "CP437.F08": 08, "CP437.F14": 14, "CP437.F16": 16, "CP58152.F08": 08, "CP58152.F14": 14, "CP58152.F16": 16, "CP58210.F08": 08, "CP58210.F14": 14, "CP58210.F16": 16, "CP58335.F08": 08, "CP58335.F14": 14, "CP58335.F16": 16, "CP59234.F08": 08, "CP59234.F14": 14, "CP59234.F16": 16, "CP59829.F08": 08, "CP59829.F14": 14, "CP59829.F16": 16, "CP60258.F08": 08, "CP60258.F14": 14, "CP60258.F16": 16, "CP60853.F08": 08, "CP60853.F14": 14, "CP60853.F16": 16, "CP62306.F08": 08, "CP62306.F14": 14, "CP62306.F16": 16, "CP667.F08": 08, "CP667.F14": 14, "CP667.F16": 16, "CP668.F08": 08, "CP668.F14": 14, "CP668.F16": 16, "CP737.F08": 08, "CP737.F14": 14, "CP737.F16": 16, "CP770.F08": 08, "CP770.F14": 14, "CP770.F16": 16, "CP771.F08": 08, "CP771.F14": 14, "CP771.F16": 16, "CP772.F08": 08, "CP772.F14": 14, "CP772.F16": 16, "CP773.F08": 08, "CP773.F14": 14, "CP773.F16": 16, "CP774.F08": 08, "CP774.F14": 14, "CP774.F16": 16, "CP775.F08": 08, "CP775.F14": 14, "CP775.F16": 16, "CP777.F08": 08, "CP777.F14": 14, "CP777.F16": 16, "CP778.F08": 08, "CP778.F14": 14, "CP778.F16": 16, "CP790.F08": 08, "CP790.F14": 14, "CP790.F16": 16, "CP808.F08": 08, "CP808.F14": 14, "CP808.F16": 16, "CP848.F08": 08, "CP848.F14": 14, "CP848.F16": 16, "CP849.F08": 08, "CP849.F14": 14, "CP849.F16": 16, "CP850.F08": 08, "CP850.F14": 14, "CP850.F16": 16, "CP851.F08": 08, "CP851.F14": 14, "CP851.F16": 16, "CP852.F08": 08, "CP852.F14": 14, "CP852.F16": 16, "CP853.F08": 08, "CP853.F14": 14, "CP853.F16": 16, "CP855.F08": 08, "CP855.F14": 14, "CP855.F16": 16, "CP856.F08": 08, "CP856.F14": 14, "CP856.F16": 16, "CP857.F08": 08, "CP857.F14": 14, "CP857.F16": 16, "CP858.F08": 08, "CP858.F14": 14, "CP858.F16": 16, "CP859.F08": 08, "CP859.F14": 14, "CP859.F16": 16, "CP860.F08": 08, "CP860.F14": 14, "CP860.F16": 16, "CP861.F08": 08, "CP861.F14": 14, "CP861.F16": 16, "CP862.F08": 08, "CP862.F14": 14, "CP862.F16": 16, "CP863.F08": 08, "CP863.F14": 14, "CP863.F16": 16, "CP864.F08": 08, "CP864.F14": 14, "CP864.F16": 16, "CP865.F08": 08, "CP865.F14": 14, "CP865.F16": 16, "CP866.F08": 08, "CP866.F14": 14, "CP866.F16": 16, "CP867.F08": 08, "CP867.F14": 14, "CP867.F16": 16, "CP869.F08": 08, "CP869.F14": 14, "CP869.F16": 16, "CP872.F08": 08, "CP872.F14": 14, "CP872.F16": 16, "CP895.F08": 08, "CP895.F14": 14, "CP895.F16": 16, "CP899.F08": 08, "CP899.F14": 14, "CP899.F16": 16, "CP991.F08": 08, "CP991.F14": 14, "CP991.F16": 16, "CP1124.F08": 08, "CP1124.F14": 14, "CP1124.F16": 16, "CP58163.F08": 08, "CP58163.F14": 14, "CP58163.F16": 16, "CP58258.F08": 08, "CP58258.F14": 14, "CP58258.F16": 16, "CP58259.F08": 08, "CP58259.F14": 14, "CP58259.F16": 16, "CP59187.F08": 08, "CP59187.F14": 14, "CP59187.F16": 16, "CP59283.F08": 08, "CP59283.F14": 14, "CP59283.F16": 16, "CP60211.F08": 08, "CP60211.F14": 14, "CP60211.F16": 16, "CP61235.F08": 08, "CP61235.F14": 14, "CP61235.F16": 16, "CP63283.F08": 08, "CP63283.F14": 14, "CP63283.F16": 16, "CP65500.F08": 08, "CP65500.F14": 14, "CP65500.F16": 16, "CP65501.F08": 08, "CP65501.F14": 14, "CP65501.F16": 16, "CP65502.F08": 08, "CP65502.F14": 14, "CP65502.F16": 16, "CP65503.F08": 08, "CP65503.F14": 14, "CP65503.F16": 16, "CP65504.F08": 08, "CP65504.F14": 14, "CP65504.F16": 16, "CP813.F08": 08, "CP813.F14": 14, "CP813.F16": 16, "CP819.F08": 08, "CP819.F14": 14, "CP819.F16": 16, "CP901.F08": 08, "CP901.F14": 14, "CP901.F16": 16, "CP902.F08": 08, "CP902.F14": 14, "CP902.F16": 16, "CP912.F08": 08, "CP912.F14": 14, "CP912.F16": 16, "CP913.F08": 08, "CP913.F14": 14, "CP913.F16": 16, "CP914.F08": 08, "CP914.F14": 14, "CP914.F16": 16, "CP915.F08": 08, "CP915.F14": 14, "CP915.F16": 16, "CP919.F08": 08, "CP919.F14": 14, "CP919.F16": 16, "CP920.F08": 08, "CP920.F14": 14, "CP920.F16": 16, "CP921.F08": 08, "CP921.F14": 14, "CP921.F16": 16, "CP922.F08": 08, "CP922.F14": 14, "CP922.F16": 16, "CP923.F08": 08, "CP923.F14": 14, "CP923.F16": 16, "CP58222.F08": 08, "CP58222.F14": 14, "CP58222.F16": 16, "CP59246.F08": 08, "CP59246.F14": 14, "CP59246.F16": 16, "CP60270.F08": 08, "CP60270.F14": 14, "CP60270.F16": 16, "CP61294.F08": 08, "CP61294.F14": 14, "CP61294.F16": 16, "CP62318.F08": 08, "CP62318.F14": 14, "CP62318.F16": 16, "CP63342.F08": 08, "CP63342.F14": 14, "CP63342.F16": 16, "CP878.F08": 08, "CP878.F14": 14, "CP878.F16": 16, "CP1275.F08": 08, "CP1275.F14": 14, "CP1275.F16": 16, "CP1280.F08": 08, "CP1280.F14": 14, "CP1280.F16": 16, "CP1281.F08": 08, "CP1281.F14": 14, "CP1281.F16": 16, "CP1282.F08": 08, "CP1282.F14": 14, "CP1282.F16": 16, "CP1283.F08": 08, "CP1283.F14": 14, "CP1283.F16": 16, "CP1284.F08": 08, "CP1284.F14": 14, "CP1284.F16": 16, "CP1285.F08": 08, "CP1285.F14": 14, "CP1285.F16": 16, "CP1286.F08": 08, "CP1286.F14": 14, "CP1286.F16": 16, "CP58619.F08": 08, "CP58619.F14": 14, "CP58619.F16": 16, "CP58627.F08": 08, "CP58627.F14": 14, "CP58627.F16": 16, "CP58630.F08": 08, "CP58630.F14": 14, "CP58630.F16": 16, "CP1051.F08": 08, "CP1051.F14": 14, "CP1051.F16": 16, "CP1287.F08": 08, "CP1287.F14": 14, "CP1287.F16": 16, "CP1288.F08": 08, "CP1288.F14": 14, "CP1288.F16": 16, "CP62259.F08": 08, "CP62259.F14": 14, "CP62259.F16": 16, "CP65505.F08": 08, "CP65505.F14": 14, "CP65505.F16": 16, "CP1250.F08": 08, "CP1250.F14": 14, "CP1250.F16": 16, "CP1251.F08": 08, "CP1251.F14": 14, "CP1251.F16": 16, "CP1252.F08": 08, "CP1252.F14": 14, "CP1252.F16": 16, "CP1253.F08": 08, "CP1253.F14": 14, "CP1253.F16": 16, "CP1254.F08": 08, "CP1254.F14": 14, "CP1254.F16": 16, "CP1257.F08": 08, "CP1257.F14": 14, "CP1257.F16": 16, "CP1270.F08": 08, "CP1270.F14": 14, "CP1270.F16": 16, "CP1361.F08": 08, "CP1361.F14": 14, "CP1361.F16": 16, "CP58595.F08": 08, "CP58595.F14": 14, "CP58595.F16": 16, "CP58596.F08": 08, "CP58596.F14": 14, "CP58596.F16": 16, "CP58598.F08": 08, "CP58598.F14": 14, "CP58598.F16": 16, "CP58601.F08": 08, "CP58601.F14": 14, "CP58601.F16": 16, "CP59619.F08": 08, "CP59619.F14": 14, "CP59619.F16": 16, "CP59620.F08": 08, "CP59620.F14": 14, "CP59620.F16": 16, "CP60643.F08": 08, "CP60643.F14": 14, "CP60643.F16": 16, "CP61667.F08": 08, "CP61667.F14": 14, "CP61667.F16": 16, "CP62691.F08": 08, "CP62691.F14": 14, "CP62691.F16": 16, "CP65506.F08": 08, "CP65506.F14": 14, "CP65506.F16": 16, "437_US.F08": 08, "437_US.F10": 10, "437_US.F12": 12, "437_US.F14": 14, "437_US.F16": 16, "437_US.F18": 18, "737_GRE.F08": 08, "737_GRE.F10": 10, "737_GRE.F12": 12, "737_GRE.F14": 14, "737_GRE.F16": 16, "737_GRE.F18": 18, "850_LAT1.F08": 08, "850_LAT1.F10": 10, "850_LAT1.F12": 12, "850_LAT1.F14": 14, "850_LAT1.F16": 16, "850_LAT1.F18": 18, "852_LAT2.F08": 08, "852_LAT2.F10": 10, "852_LAT2.F12": 12, "852_LAT2.F14": 14, "852_LAT2.F16": 16, "852_LAT2.F18": 18, "855_CYR.F08": 08, "855_CYR.F10": 10, "855_CYR.F12": 12, "855_CYR.F14": 14, "855_CYR.F16": 16, "855_CYR.F18": 18, "862_HEB.F08": 08, "862_HEB.F10": 10, "862_HEB.F12": 12, "862_HEB.F14": 14, "862_HEB.F16": 16, "862_HEB.F18": 18, "864_ARA.F08": 08, "864_ARA.F10": 10, "864_ARA.F12": 12, "864_ARA.F14": 14, "864_ARA.F16": 16, "864_ARA.F18": 18, "866_RUS.F08": 08, "866_RUS.F10": 10, "866_RUS.F12": 12, "866_RUS.F14": 14, "866_RUS.F16": 16, "866_RUS.F18": 18, "874_THA.F08": 08, "874_THA.F10": 10, "874_THA.F12": 12, "874_THA.F14": 14, "874_THA.F16": 16, "874_THA.F18": 18, "CN-PRCHN.F16": 16, "CN-PRCHN.F19": 19, "CN-TW437.F16": 16, "CN-TW437.F19": 19, "CN-TWNHN.F16": 16, "CN-TWNHN.F19": 19, "CP437.F08": 08, "CP437.F14": 14, "CP437.F16": 16, "CP850.F08": 08, "CP850.F14": 14, "CP850.F16": 16, "CP852.F08": 08, "CP852.F14": 14, "CP852.F16": 16, "CP855.F08": 08, "CP855.F14": 14, "CP855.F16": 16, "CP857.F08": 08, "CP857.F14": 14, "CP857.F16": 16, "CP860.F08": 08, "CP860.F14": 14, "CP860.F16": 16, "CP861.F08": 08, "CP861.F14": 14, "CP861.F16": 16, "CP863.F08": 08, "CP863.F14": 14, "CP863.F16": 16, "CP865.F08": 08, "CP865.F14": 14, "CP865.F16": 16, "CP866.F08": 08, "CP866.F14": 14, "CP866.F16": 16, "CP869.F08": 08, "CP869.F14": 14, "CP869.F16": 16, "CP912.F08": 08, "CP912.F14": 14, "CP912.F16": 16, "CP915.F08": 08, "CP915.F14": 14, "CP915.F16": 16, "ISOCP437.F16": 16, "ISOCP850.F16": 16, "ISOCP852.F16": 16, "ISOCP855.F16": 16, "ISOCP857.F16": 16, "ISOCP860.F16": 16, "ISOCP861.F16": 16, "ISOCP863.F16": 16, "ISOCP866.F16": 16, "ISOCP869.F16": 16, "J700C-V.F16": 16, "J700C-V.F19": 19, "KR-DOS.F16": 16, "16.F16": 16, "16_CYR.F16": 16, "16_GFX.F16": 16, "16_GRE.F16": 16, "16_HEB.F16": 16, "16_LT1.F16": 16, "16_LT2.F16": 16, "16_RUS.F16": 16, "8.F08": 08, "8_CYR.F08": 08, "8_GFX.F08": 08, "8_GRE.F08": 08, "8_HEB.F08": 08, "8_LT1.F08": 08, "8_LT2.F08": 08, "8_RUS.F08": 08, "ALT8.F08": 08, "ALT8_CYR.F08": 08, "ALT8_GFX.F08": 08, "ALT8_GRE.F08": 08, "ALT8_HEB.F08": 08, "ALT8_LT1.F08": 08, "ALT8_LT2.F08": 08, "ALT8_RUS.F08": 08, "FANT.F08": 08, "FANT_CYR.F08": 08, "FANT_GFX.F08": 08, "FANT_GRE.F08": 08, "FANT_HEB.F08": 08, "FANT_LT1.F08": 08, "FANT_LT2.F08": 08, "FANT_RUS.F08": 08, "MCR.F08": 08, "MCR_CYR.F08": 08, "MCR_GFX.F08": 08, "MCR_GRE.F08": 08, "MCR_HEB.F08": 08, "MCR_LT1.F08": 08, "MCR_LT2.F08": 08, "MCR_RUS.F08": 08, "TALL.F16": 16, "TALL_CYR.F16": 16, "TALL_GFX.F16": 16, "TALL_GRE.F16": 16, "TALL_HEB.F16": 16, "TALL_LT1.F16": 16, "TALL_LT2.F16": 16, "TALL_RUS.F16": 16, "THIN.F08": 08, "THIN_CYR.F08": 08, "THIN_GFX.F08": 08, "THIN_GRE.F08": 08, "THIN_HEB.F08": 08, "THIN_LT1.F08": 08, "THIN_LT2.F08": 08, "THIN_RUS.F08": 08,  }
};

const moebius_menu = {
    label: "Mœbius",
    submenu: [
        {role: "about", label: "About Mœbius"},
        {type: "separator"},
        {label: "Preferences", id: "preferences", accelerator: "CmdorCtrl+,", click(item) {event.emit("preferences");}},
        {type: "separator"},
        {role: "services"},
        {type: "separator"},
        {role: "hide", label: "Hide Mœbius"},
        {role: "hideothers"},
        {role: "unhide"},
        {type: "separator"},
        {role: "quit", label: "Quit Mœbius"}
    ]
};

const bare_file = {
    label: "File",
    submenu: [
        {role: "close"}
    ]
};

const bare_edit = {
    label: "Edit",
    submenu: [
        {label: "Undo", accelerator: "Cmd+Z", role: "undo"},
        {label: "Redo", accelerator: "Cmd+Shift+Z", role: "redo"},
        {type: "separator"},
        {label: "Cut", accelerator: "Cmd+X", role: "cut"},
        {label: "Copy", accelerator: "Cmd+C", role: "copy"},
        {label: "Paste", accelerator: "Cmd+V", role: "paste"},
        {label: "Select All", accelerator: "Cmd+A", role: "selectall"}
    ]
};

const window_menu_items = {
    label: "Window",
    submenu: [
        {role: "minimize"},
        {role: "zoom"},
        {type: "separator"},
        {role: "front"}
    ]
};

const help_menu_items = {
    label: "Help", role: "help", submenu: [
        {label: "Enable Function Keys on MacOS", id: "enable_function_keys", click(item) {electron.shell.openExternal("file:///System/Library/PreferencePanes/Keyboard.prefPane/");}, enabled: darwin},
        {type: "separator"},
        {label: "Cheatsheet", id: "show_cheatsheet", click(item) {event.emit("show_cheatsheet");}},
        {label: "Show Numpad Mappings", id: "show_numpad_mappings", click(item) {event.emit("show_numpad_mappings");}},
        {type: "separator"},
        {label: "Acknowledgements", id: "show_cheatsheet", click(item) {event.emit("show_acknowledgements");}},
        {type: "separator"},
        {label: "ANSI Art Tutorials at 16Colors", id: "changelog", click(item) {electron.shell.openExternal("https://16colo.rs/tags/content/tutorial");}},
        {label: "Mœbius Homepage", id: "show_homepage", click(item) {electron.shell.openExternal("http://www.andyh.org/moebius/");}},
        {label: "Source Code at GitHub", id: "show_repo", click(item) {electron.shell.openExternal("https://github.com/blocktronics/moebius");}},
        {label: "Raise an Issue at GitHub", id: "show_issues", click(item) {electron.shell.openExternal("https://github.com/blocktronics/moebius/issues");}},
        {type: "separator"},
        {label: "Changelog", id: "changelog", click(item) {event.emit("show_changelog");}},
    ]
};

const application = electron.Menu.buildFromTemplate([moebius_menu, {
    label: "File",
    submenu: [
        {label: "New", id: "new_document", accelerator: "Cmd+N", click(item) {event.emit("new_document");}},
        {type: "separator"},
        {label: "Open\u2026", id: "open", accelerator: "Cmd+O", click(item) {event.emit("open");}},
        {role: "recentDocuments", submenu: [{role: "clearRecentDocuments"}]},
        {type: "separator"},
        {role: "close"},
    ]
}, bare_edit, {
    label: "Network", submenu: [
        {label: "Connect to Server…", accelerator: "Cmd+Alt+S", id: "connect_to_server", click(item) {event.emit("show_new_connection_window");}},
    ]
}, window_menu_items, help_menu_items
]);

function file_menu_template(win) {
    return {
        label: "&File",
        submenu: [
            {label: "New", id: "new_document", accelerator: "CmdorCtrl+N", click(item) {event.emit("new_document");}},
            {label: "Duplicate as New Document", id: "duplicate", click(item) {win.send("duplicate");}},
            {type: "separator"},
            {label: "Open\u2026", id: "open", accelerator: "CmdorCtrl+O", click(item) {event.emit("open", win);}},
            darwin ? {role: "recentDocuments", submenu: [{role: "clearRecentDocuments"}]} : ({type: "separator"}, {label: "Settings", click(item) {event.emit("preferences");}}),
            {type: "separator"},
            {label: "Revert to Last Save", id: "revert_to_last_save", click(item) {win.send("revert_to_last_save");}, enabled: false},
            {label: "Show File in Folder", id: "show_file_in_folder", click(item) {win.send("show_file_in_folder");}, enabled: false},
            {type: "separator"},
            {label: "Edit Sauce Info\u2026", id: "edit_sauce_info", accelerator: "CmdorCtrl+I", click(item) {win.send("get_sauce_info");}},
            {type: "separator"},
            {label: "Save", id: "save", accelerator: "CmdorCtrl+S", click(item) {win.send("save");}},
            {label: "Save As\u2026", id: "save_as", accelerator: "CmdorCtrl+Shift+S", click(item) {win.send("save_as");}},
            {type: "separator"},
            {label: "Share Online", id: "share_online", click(item) {win.send("share_online");}},
            {label: "Share Online (XBIN)", id: "share_online_xbin", click(item) {win.send("share_online_xbin");}},
            { type: "separator" },
            {label: "Export As PNG\u2026", id: "export_as_png", accelerator: "CmdorCtrl+Shift+E", click(item) {win.send("export_as_png");}},
            {label: "Export As Animated PNG\u2026", id: "export_as_apng", accelerator: "CmdorCtrl+Shift+A", click(item) {win.send("export_as_apng");}},
            {type: "separator"},
            {label: "Export As UTF-8\u2026", id: "export_as_utf8", accelerator: "CmdorCtrl+Shift+U", click(item) {win.send("export_as_utf8");}},
            {type: "separator"},
            {role: "close", accelerator: darwin ? "Cmd+W" : "Alt+F4"}
        ]
    };
}

function edit_menu_template(win, chat) {
    return {
        label: "&Edit",
        submenu: [
            chat ? {label: "Undo", accelerator: "Cmd+Z", role: "undo"} : {label: "Undo", id: "undo", accelerator: darwin ? "Cmd+Z" : "", click(item) {win.send("undo");}, enabled: false},
            chat ? {label: "Redo", accelerator: "Cmd+Shift+Z", role: "redo"} : {label: "Redo", id: "redo", accelerator: darwin ? "Cmd+Shift+Z" : "", click(item) {win.send("redo");}, enabled: false},
            {type: "separator"},
            {label: "Toggle Insert Mode", id: "toggle_insert_mode", accelerator: darwin ? "" : "Insert", type: "checkbox", click(item) {win.send("insert_mode", item.checked);}, checked: false},
            {label: "Toggle Overwrite Mode", id: "overwrite_mode", accelerator: "CmdorCtrl+Alt+O", click(item) {win.send("overwrite_mode", item.checked);}, type: "checkbox", checked: false},
            {type: "separator"},
            {label: "Mirror Mode", id: "mirror_mode", accelerator: "CmdorCtrl+Alt+M", click(item) {win.send("mirror_mode", item.checked);}, type: "checkbox", checked: false},
            {type: "separator"},
            chat ? {label: "Cut", accelerator: "Cmd+X", role: "cut"} : {label: "Cut", id: "cut", accelerator: "CmdorCtrl+X", click(item) {win.send("cut");}, enabled: false},
            chat ? {label: "Copy", accelerator: "Cmd+C", role: "copy"} : {label: "Copy", id: "copy", accelerator: "CmdorCtrl+C", click(item) {win.send("copy");}, enabled: false},
            chat ? {label: "Paste", accelerator: "Cmd+V", role: "paste"} : {label: "Paste", id: "paste", accelerator: "CmdorCtrl+V", click(item) {win.send("paste");}, enabled: true},
            {label: "Paste As Selection", id: "paste_as_selection", accelerator: "CmdorCtrl+Alt+V", click(item) {win.send("paste_as_selection");}, enabled: true},
            {type: "separator"},
            {label: "Left Justify Line", id: "left_justify_line", accelerator: "Alt+L", click(item) {win.send("left_justify_line");}, enabled: true},
            {label: "Right Justify Line", id: "right_justify_line", accelerator: "Alt+R", click(item) {win.send("right_justify_line");}, enabled: true},
            {label: "Center Line", id: "center_line", accelerator: "Alt+C", click(item) {win.send("center_line");}, enabled: true},
            {type: "separator"},
            {label: "Insert Row", id: "insert_row", accelerator: "Alt+Up", click(item) {win.send("insert_row");}, enabled: true},
            {label: "Delete Row", id: "delete_row", accelerator: "Alt+Down", click(item) {win.send("delete_row");}, enabled: true},
            {type: "separator"},
            {label: "Insert Column", id: "insert_column", accelerator: "Alt+Right", click(item) {win.send("insert_column");}, enabled: true},
            {label: "Delete Column", id: "delete_column", accelerator: "Alt+Left", click(item) {win.send("delete_column");}, enabled: true},
            {type: "separator"},
            {label: "Erase Row", id: "erase_line", accelerator: "Alt+E", click(item) {win.send("erase_line");}, enabled: true},
            {label: "Erase to Start of Row", id: "erase_to_start_of_line", accelerator: "Alt+Home", click(item) {win.send("erase_to_start_of_line");}, enabled: true},
            {label: "Erase to End of Row", id: "erase_to_end_of_line", accelerator: "Alt+End", click(item) {win.send("erase_to_end_of_line");}, enabled: true},
            {type: "separator"},
            {label: "Erase Column", id: "erase_column", accelerator: "Alt+Shift+E", click(item) {win.send("erase_column");}, enabled: true},
            {label: "Erase to Start of Column", id: "erase_to_start_of_column", accelerator: "Alt+PageUp", click(item) {win.send("erase_to_start_of_column");}, enabled: true},
            {label: "Erase to End of Column", id: "erase_to_end_of_column", accelerator: "Alt+PageDown", click(item) {win.send("erase_to_end_of_column");}, enabled: true},
            {type: "separator"},
            {label: "Scroll Canvas Up", id: "scroll_canvas_up", accelerator: "Ctrl+Alt+Up", click(item) {win.send("scroll_canvas_up");}, enabled: true},
            {label: "Scroll Canvas Down", id: "scroll_canvas_down", accelerator: "Ctrl+Alt+Down", click(item) {win.send("scroll_canvas_down");}, enabled: true},
            {label: "Scroll Canvas Right", id: "scroll_canvas_right", accelerator: "Ctrl+Alt+Right", click(item) {win.send("scroll_canvas_right");}, enabled: true},
            {label: "Scroll Canvas Left", id: "scroll_canvas_left", accelerator: "Ctrl+Alt+Left", click(item) {win.send("scroll_canvas_left");}, enabled: true},
            {type: "separator"},
            {label: "Set Canvas Size\u2026", id: "set_canvas_size", accelerator: "CmdorCtrl+Alt+C", click(item) {win.send("get_canvas_size");}, enabled: true},
        ]
    };
}

function selection_menu_template(win, chat) {
    return {
        label: "&Selection",
        submenu: [
            chat ? {label: "Select All", accelerator: "Cmd+A", role: "selectall"} : {label: "Select All", id: "select_all", accelerator: "CmdorCtrl+A", click(item) {win.send("select_all");}},
            {label: "Deselect", id: "deselect", click(item) {win.send("deselect");}, enabled: false},
            {type: "separator"},
            {label: "Import\u2026", id: "import_selection", click(item) {win.send("import_selection");}},
            {label: "Export\u2026", id: "export_selection", click(item) {win.send("export_selection");}, enabled: false},
            {type: "separator"},
            {label: "Start Selection", id: "start_selection", accelerator: "Alt+B", click(item) {win.send("start_selection");}, enabled: false},
            {type: "separator"},
            {label: "Move Block", id: "move_block", accelerator: "M", click(item) {win.send("move_block");}, enabled: false},
            {label: "Copy Block", id: "copy_block", accelerator: "C", click(item) {win.send("copy_block");}, enabled: false},
            {type: "separator"},
            {label: "Fill", id: "fill", accelerator: "F", click(item) {win.send("fill");}, enabled: false},
            {label: "Erase", id: "erase", accelerator: "E", click(item) {win.send("erase");}, enabled: false},
            {label: "Stamp", id: "stamp", accelerator: "S", click(item) {win.send("stamp");}, enabled: false},
            {label: "Place", id: "place", accelerator: "Enter", click(item) {win.send("place");}, enabled: false},
            {label: "Rotate", id: "rotate", accelerator: "R", click(item) {win.send("rotate");}, enabled: false},
            {label: "Flip X", id: "flip_x", accelerator: "X", click(item) {win.send("flip_x");}, enabled: false},
            {label: "Flip Y", id: "flip_y", accelerator: "Y", click(item) {win.send("flip_y");}, enabled: false},
            {label: "Center", id: "center", accelerator: "=", click(item) {win.send("center");}, enabled: false},
            {type: "separator"},
            {label: "Transparent", id: "transparent", accelerator: "T", click(item) {win.send("transparent", item.checked);}, type: "checkbox", checked: false, enabled: false},
            {label: "Over", id: "over", accelerator: "O", click(item) {win.send("over", item.checked);}, type: "checkbox", checked: false, enabled: false},
            {label: "Underneath", id: "underneath", accelerator: "U", click(item) {win.send("underneath", item.checked);}, type: "checkbox", checked: false, enabled: false},
            {type: "separator"},
            {label: "Crop", id: "crop", accelerator: "CmdorCtrl+K", click(item) {win.send("crop");}, enabled: false},
        ]
    };
}

function font_menu_items(win) {
    return Object.keys(font_list).map((menu_title) => {
        return {label: menu_title, submenu: Object.keys(font_list[menu_title]).map((font_name) => {
            return {label: `${font_name} (8×${font_list[menu_title][font_name]})`, id: font_name, click(item) {win.send("change_font", font_name);}, type: "checkbox", checked: false};
        })};
    });
}

function view_menu_template(win) {
    return {
        label: "&View",
        submenu: [
            {label: "Keyboard Mode", id: "change_to_select_mode", accelerator: "K", click(item) {win.send("change_to_select_mode");}, enabled: false},
            {label: "Brush Mode", id: "change_to_brush_mode", accelerator: "B", click(item) {win.send("change_to_brush_mode");}, enabled: false},
            {label: "Shifter Mode", id: "change_to_shifter_mode", accelerator: "I", click(item) {win.send("change_to_shifter_mode");}, enabled: false},
            {label: "Paintbucket Mode", id: "change_to_fill_mode", accelerator: "P", click(item) {win.send("change_to_fill_mode");}, enabled: false},
            {type: "separator"},
            {label: "Show Status Bar", id: "show_status_bar", accelerator: "CmdorCtrl+/", click(item) {win.send("show_statusbar", item.checked);}, type: "checkbox", checked: true},
            {label: "Show Tool Bar", id: "show_tool_bar", accelerator: "CmdorCtrl+T", click(item) {win.send("show_toolbar", item.checked);}, type: "checkbox", checked: true},
            {label: "Show Preview", id: "show_preview", accelerator: "CmdorCtrl+Alt+P", click(item) {win.send("show_preview", item.checked);}, type: "checkbox", checked: true},
            {label: "Show Character List", id: "show_charlist", accelerator: "CmdorCtrl+Alt+L", click(item) {win.send("show_charlist", item.checked);}, type: "checkbox", checked: true},
            { type: "separator" },
            {label: "Previous Character Set", id: "previous_character_set", accelerator: "Ctrl+,", click(item) {win.send("previous_character_set");}, enabled: true},
            {label: "Next Character Set", id: "next_character_set", accelerator: "Ctrl+.", click(item) {win.send("next_character_set");}, enabled: true},
            {label: "Default Character Set", id: "default_character_set", accelerator: "Ctrl+/", click(item) {win.send("default_character_set");}, enabled: true},
            {type: "separator"},
            {label: "Use 9px Font", id: "use_9px_font", accelerator: "CmdorCtrl+F", click(item) {win.send("use_9px_font", item.checked);}, type: "checkbox", checked: false},
            {type: "separator"},
            {label: "Actual Size", id: "actual_size", accelerator: "CmdorCtrl+Alt+0", click(item) {win.send("actual_size");}, type: "checkbox", checked: false},
            {label: "Zoom In", id: "zoom_in", accelerator: "CmdorCtrl+=", click(item) {win.send("zoom_in");}},
            {label: "Zoom Out", id: "zoom_out", accelerator: "CmdorCtrl+-", click(item) {win.send("zoom_out");}},
            {type: "separator"},
            {label: "Change Font", submenu: font_menu_items(win)},
            {label: "Load Custom Font\u2026", id: "loadcustomfont", click(item) {win.send("change_font", "Custom");}},
            {label: "Reset to default font\u2026", id: "resetxbinfont", click(item) {win.send("change_font", "Default");}},
            {label: "Export font\u2026", id: "export_font", click(item) {win.send("export_font");}},
            { type: "separator" },
            {label: "Guides", submenu: [
                {label: "Smallscale (80×25)", id: "smallscale_guide", click(item) {win.send("toggle_smallscale_guide", item.checked);}, type: "checkbox", checked: false},
                {label: "Square (80×40)", id: "square_guide", click(item) {win.send("toggle_square_guide", item.checked);}, type: "checkbox", checked: false},
                {label: "Instagram (80×50)", id: "instagram_guide", click(item) {win.send("toggle_instagram_guide", item.checked);}, type: "checkbox", checked: false},
                {label: "File ID (44×22)", id: "file_id_guide", click(item) {win.send("toggle_file_id_guide", item.checked);}, type: "checkbox", checked: false},
            ]},
            {type: "separator"},
            {label: "Open Reference Image\u2026", id: "open_reference_image", accelerator: "CmdorCtrl+Shift+O", click(item) {win.send("open_reference_image");}},
            {label: "Toggle Reference Image", id: "toggle_reference_image", accelerator: "Ctrl+Tab", click(item) {win.send("toggle_reference_image", item.checked);}, enabled: false, type: "checkbox", checked: true},
            {label: "Clear", id: "clear_reference_image", click(item) {win.send("clear_reference_image");}, enabled: false},
            {type: "separator"},
            {label: "Scroll Document With Cursor", id: "scroll_document_with_cursor", accelerator: "CmdorCtrl+R", click(item) {win.send("scroll_document_with_cursor", item.checked);}, type: "checkbox", checked: false},
            {type: "separator"},
            {role: "togglefullscreen", accelerator: "CmdorCtrl+Alt+F"},
        ]
    };
}

function colors_menu_template(win) {
    return {
        label: "Colors",
        submenu: [
            {label: "Select Attribute", id: "select_attribute", accelerator: "Alt+A", click(item) {win.send("select_attribute");}},
            {type: "separator"},
            {label: "Previous Foreground Color", id: "previous_foreground_color", accelerator: "Ctrl+Up", click(item) {win.send("previous_foreground_color");}},
            {label: "Next Foreground Color", id: "next_foreground_color", accelerator: "Ctrl+Down", click(item) {win.send("next_foreground_color");}},
            {type: "separator"},
            {label: "Previous Background Color", id: "previous_background_colour", accelerator: "Ctrl+Left", click(item) {win.send("previous_background_color");}},
            {label: "Next Background Color", id: "next_background_color", accelerator: "Ctrl+Right", click(item) {win.send("next_background_color");}},
            {type: "separator"},
            {label: "Use Attribute Under Cursor", id: "use_attribute_under_cursor", accelerator: "Alt+U", click(item) {win.send("use_attribute_under_cursor");}},
            {label: "Default Color", id: "default_color", accelerator: "CmdorCtrl+D", click(item) {win.send("default_color");}},
            {label: "Switch Foreground / Background", id: "switch_foreground_background", accelerator: "Shift+CmdorCtrl+X", click(item) {win.send("switch_foreground_background");}},
            {type: "separator"},
            {label: "Use iCE Colors", id: "ice_colors", accelerator: "CmdorCtrl+E", click(item) {win.send("ice_colors", item.checked);}, type: "checkbox", checked: false},
        ]
    };
}

function network_menu_template(win, enabled) {
    return {
        label: "&Network", submenu: [
            {label: "Connect to Server…", id: "connect_to_server", accelerator: "CmdorCtrl+Alt+S", click(item) {event.emit("show_new_connection_window");}},
            {type: "separator"},
            {label: "Toggle Chat Window", id: "chat_window_toggle", accelerator: "CmdorCtrl+[", click(item) {win.send("chat_window_toggle");}, enabled},
        ]
    };
}

function debug_menu_template(win) {
    return {
        label: "Debug",
        submenu: [
            {label: "Open Dev Tools", id: "open_dev_tools", click(item) {win.openDevTools({mode: "detach"});}}
        ]
    };
}

function create_menu_template(win, chat, debug) {
    const menu_lists = [file_menu_template(win), edit_menu_template(win, chat), selection_menu_template(win, chat), colors_menu_template(win), view_menu_template(win), network_menu_template(win, chat)];
    if (debug) menu_lists.push(debug_menu_template(win));
    return menu_lists;
}

function get_menu_item(id, name) {
    return menus[id].getMenuItemById(name);
}

function get_chat_menu_item(id, name) {
    return chat_menus[id].getMenuItemById(name);
}

function enable(id, name) {
    get_menu_item(id, name).enabled = true;
    if (name != "cut" && name != "copy" && name != "paste" && name != "undo" && name != "redo" && name != "select_all") get_chat_menu_item(id, name).enabled = true;
}

function disable(id, name) {
    get_menu_item(id, name).enabled = false;
    if (name != "cut" && name != "copy" && name != "paste" && name != "undo" && name != "redo" && name != "select_all") get_chat_menu_item(id, name).enabled = false;
}

function check(id, name) {
    get_menu_item(id, name).checked = true;
    get_chat_menu_item(id, name).checked = true;
}

function uncheck(id, name) {
    get_menu_item(id, name).checked = false;
    get_chat_menu_item(id, name).checked = false;
}

function set_check(id, name, value) {
    get_menu_item(id, name).checked = value;
    get_chat_menu_item(id, name).checked = value;
}

electron.ipcMain.on("set_file", (event, {id}) => {
    enable(id, "show_file_in_folder");
    enable(id, "revert_to_last_save");
});

electron.ipcMain.on("enable_undo", (event, {id}) => {
    enable(id, "undo");
});

electron.ipcMain.on("disable_undo", (event, {id}) => {
    disable(id, "undo");
});

electron.ipcMain.on("enable_redo", (event, {id}) => {
    enable(id, "redo");
});

electron.ipcMain.on("disable_redo", (event, {id}) => {
    disable(id, "redo");
});

electron.ipcMain.on("enable_reference_image", (event, {id}) => {
    enable(id, "toggle_reference_image");
    check(id, "toggle_reference_image");
    enable(id, "clear_reference_image");
});

electron.ipcMain.on("disable_clear_reference_image", (event, {id}) => {
    disable(id, "toggle_reference_image");
    disable(id, "clear_reference_image");
});

electron.ipcMain.on("enable_selection_menu_items", (event, {id}) => {
    enable(id, "cut");
    enable(id, "copy");
    enable(id, "erase");
    enable(id, "fill");
    disable(id, "paste");
    disable(id, "paste_as_selection");
    enable(id, "deselect");
    enable(id, "move_block");
    enable(id, "copy_block");
    enable(id, "crop");
    enable(id, "export_selection");
    disable(id, "left_justify_line");
    disable(id, "right_justify_line");
    disable(id, "center_line");
    disable(id, "erase_line");
    disable(id, "erase_to_start_of_line");
    disable(id, "erase_to_end_of_line");
    disable(id, "erase_column");
    disable(id, "erase_to_start_of_column");
    disable(id, "erase_to_end_of_column");
    disable(id, "insert_row");
    disable(id, "delete_row");
    disable(id, "insert_column");
    disable(id, "delete_column");
    disable(id, "scroll_canvas_up");
    disable(id, "scroll_canvas_down");
    disable(id, "scroll_canvas_left");
    disable(id, "scroll_canvas_right");
    disable(id, "use_attribute_under_cursor");
    disable(id, "start_selection");
    disable(id, "select_attribute");
});

function disable_selection_menu_items(id) {
    disable(id, "cut");
    disable(id, "copy");
    disable(id, "erase");
    disable(id, "fill");
    disable(id, "deselect");
    disable(id, "move_block");
    disable(id, "copy_block");
    disable(id, "crop");
    disable(id, "export_selection");
    enable(id, "paste");
    enable(id, "paste_as_selection");
    enable(id, "left_justify_line");
    enable(id, "right_justify_line");
    enable(id, "center_line");
    enable(id, "erase_line");
    enable(id, "erase_to_start_of_line");
    enable(id, "erase_to_end_of_line");
    enable(id, "erase_column");
    enable(id, "erase_to_start_of_column");
    enable(id, "erase_to_end_of_column");
    enable(id, "insert_row");
    enable(id, "delete_row");
    enable(id, "insert_column");
    enable(id, "delete_column");
    enable(id, "scroll_canvas_up");
    enable(id, "scroll_canvas_down");
    enable(id, "scroll_canvas_left");
    enable(id, "scroll_canvas_right");
    enable(id, "use_attribute_under_cursor");
    enable(id, "start_selection");
}

electron.ipcMain.on("disable_selection_menu_items", (event, {id}) => disable_selection_menu_items(id));

electron.ipcMain.on("disable_selection_menu_items_except_deselect_and_crop", (event, {id}) => {
    disable_selection_menu_items(id);
    enable(id, "deselect");
    enable(id, "crop");
    enable(id, "export_selection");
});

electron.ipcMain.on("enable_operation_menu_items", (event, {id}) => {
    enable(id, "stamp");
    enable(id, "place");
    enable(id, "rotate");
    enable(id, "flip_x");
    enable(id, "flip_y");
    enable(id, "center");
    enable(id, "transparent");
    enable(id, "over");
    check(id, "over");
    enable(id, "underneath");
    disable(id, "left_justify_line");
    disable(id, "right_justify_line");
    disable(id, "center_line");
    disable(id, "erase_line");
    disable(id, "erase_to_start_of_line");
    disable(id, "erase_to_end_of_line");
    disable(id, "erase_column");
    disable(id, "erase_to_start_of_column");
    disable(id, "erase_to_end_of_column");
    disable(id, "insert_row");
    disable(id, "delete_row");
    disable(id, "insert_column");
    disable(id, "delete_column");
    disable(id, "scroll_canvas_up");
    disable(id, "scroll_canvas_down");
    disable(id, "scroll_canvas_left");
    disable(id, "scroll_canvas_right");
    disable(id, "paste");
    disable(id, "paste_as_selection");
    disable(id, "use_attribute_under_cursor");
    disable(id, "start_selection");
});

function disable_operation_menu_items(id) {
    disable(id, "stamp");
    disable(id, "place");
    disable(id, "rotate");
    disable(id, "flip_x");
    disable(id, "flip_y");
    disable(id, "center");
    disable(id, "transparent");
    uncheck(id, "transparent");
    disable(id, "over");
    uncheck(id, "over");
    disable(id, "underneath");
    uncheck(id, "underneath");
    enable(id, "paste");
    enable(id, "paste_as_selection");
    enable(id, "use_attribute_under_cursor");
}

electron.ipcMain.on("disable_operation_menu_items", (event, {id}) => disable_operation_menu_items(id));

electron.ipcMain.on("disable_editing_shortcuts", (event, {id}) => {
    disable_selection_menu_items(id);
    disable_operation_menu_items(id);
    disable(id, "use_attribute_under_cursor");
    disable(id, "left_justify_line");
    disable(id, "right_justify_line");
    disable(id, "center_line");
    disable(id, "erase_line");
    disable(id, "erase_to_start_of_line");
    disable(id, "erase_to_end_of_line");
    disable(id, "erase_column");
    disable(id, "erase_to_start_of_column");
    disable(id, "erase_to_end_of_column");
    disable(id, "insert_row");
    disable(id, "delete_row");
    disable(id, "insert_column");
    disable(id, "delete_column");
    disable(id, "scroll_canvas_up");
    disable(id, "scroll_canvas_down");
    disable(id, "scroll_canvas_left");
    disable(id, "scroll_canvas_right");
    disable(id, "paste");
    disable(id, "paste_as_selection");
    enable(id, "change_to_select_mode");
    enable(id, "change_to_brush_mode");
    enable(id, "change_to_shifter_mode");
    enable(id, "change_to_fill_mode");
    disable(id, "previous_character_set");
    disable(id, "next_character_set");
    disable(id, "default_character_set");
    disable(id, "start_selection");
});

electron.ipcMain.on("enable_editing_shortcuts", (event, {id}) => {
    disable_selection_menu_items(id);
    disable_operation_menu_items(id);
    enable(id, "use_attribute_under_cursor");
    enable(id, "left_justify_line");
    enable(id, "right_justify_line");
    enable(id, "center_line");
    enable(id, "erase_line");
    enable(id, "erase_to_start_of_line");
    enable(id, "erase_to_end_of_line");
    enable(id, "erase_column");
    enable(id, "erase_to_start_of_column");
    enable(id, "erase_to_end_of_column");
    enable(id, "insert_row");
    enable(id, "delete_row");
    enable(id, "insert_column");
    enable(id, "delete_column");
    enable(id, "scroll_canvas_up");
    enable(id, "scroll_canvas_down");
    enable(id, "scroll_canvas_left");
    enable(id, "scroll_canvas_right");
    enable(id, "paste");
    enable(id, "paste_as_selection");
    disable(id, "change_to_select_mode");
    disable(id, "change_to_brush_mode");
    disable(id, "change_to_shifter_mode");
    disable(id, "change_to_fill_mode");
    enable(id, "previous_character_set");
    enable(id, "next_character_set");
    enable(id, "default_character_set");
    enable(id, "start_selection");
    enable(id, "select_attribute");
});

electron.ipcMain.on("update_menu_checkboxes", (event, {id, insert_mode, overwrite_mode, use_9px_font, ice_colors, actual_size, font_name}) => {
    if (insert_mode != undefined) set_check(id, "toggle_insert_mode", insert_mode);
    if (overwrite_mode != undefined) set_check(id, "overwrite_mode", overwrite_mode);
    if (use_9px_font != undefined) set_check(id, "use_9px_font", use_9px_font);
    if (ice_colors != undefined) set_check(id, "ice_colors", ice_colors);
    if (actual_size != undefined) set_check(id, "actual_size", actual_size);
    if (font_name != undefined) {
        if (font_names[id]) uncheck(id, font_names[id]);
        if (get_menu_item(id, font_name)) {
            check(id, font_name);
            font_names[id] = font_name;
        }
    }
});

electron.ipcMain.on("uncheck_transparent", (event, {id}) => uncheck(id, "transparent"));
electron.ipcMain.on("uncheck_underneath", (event, {id}) => uncheck(id, "underneath"));
electron.ipcMain.on("check_underneath", (event, {id}) => check(id, "underneath"));
electron.ipcMain.on("uncheck_over", (event, {id}) => uncheck(id, "over"));
electron.ipcMain.on("check_over", (event, {id}) => check(id, "over"));

electron.ipcMain.on("check_smallscale_guide", (event, {id}) => check(id, "smallscale_guide"));
electron.ipcMain.on("check_square_guide", (event, {id}) => check(id, "square_guide"));
electron.ipcMain.on("check_instagram_guide", (event, {id}) => check(id, "instagram_guide"));
electron.ipcMain.on("check_file_id_guide", (event, {id}) => check(id, "file_id_guide"));
electron.ipcMain.on("uncheck_all_guides", (event, {id}) => {
    uncheck(id, "smallscale_guide");
    uncheck(id, "square_guide");
    uncheck(id, "instagram_guide");
    uncheck(id, "file_id_guide");
});

electron.ipcMain.on("enable_chat_window_toggle", (event, {id}) => {
    enable(id, "chat_window_toggle");
    check(id, "chat_window_toggle");
});

class MenuEvent extends events.EventEmitter {
    set_application_menu() {
        if (darwin) electron.Menu.setApplicationMenu(application);
    }

    chat_input_menu(win, debug) {
        const menu = darwin ? electron.Menu.buildFromTemplate([moebius_menu, ...create_menu_template(win, true, debug), window_menu_items, help_menu_items]) : electron.Menu.buildFromTemplate([...create_menu_template(win, true, debug), help_menu_items]);
        chat_menus[win.id] = menu;
        return menu;
    }

    get modal_menu() {
        return electron.Menu.buildFromTemplate([moebius_menu, bare_file, bare_edit, window_menu_items, help_menu_items]);
    }

    document_menu(win, debug) {
        const menu = darwin ? electron.Menu.buildFromTemplate([moebius_menu, ...create_menu_template(win, false, debug), window_menu_items, help_menu_items]) : electron.Menu.buildFromTemplate([...create_menu_template(win, false, debug), help_menu_items]);
        menus[win.id] = menu;
        return menu;
    }

    get dock_menu() {
        return electron.Menu.buildFromTemplate([
            {label: "New Document", click(item) {event.emit("new_document");}},
            {label: "Open\u2026", click(item) {event.emit("open");}},
            {label: "Preferences", click(item) {event.emit("preferences");}},
            {label: "Connect to Server…", click(item) {event.emit("show_new_connection_window");}}
        ]);
    }

    cleanup(id) {
        delete menus[id];
        delete font_names[id];
    }
}

const event = new MenuEvent();

module.exports = event;