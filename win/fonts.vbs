Option Explicit

Dim objShell, objFolder
Dim colItems, objFont

Const FONTS = &H14& ' Fonts Folder

' Instantiate Objects
Set objShell = CreateObject("Shell.Application")
Set objFolder = objShell.Namespace(FONTS)
Set colItems = objFolder.Items

For Each objFont in colItems
    WScript.StdOut.WriteLine(objFont.Path)
Next

Set objShell = nothing
Set objFolder = nothing
Set colItems = nothing
Set objFont = nothing

wscript.quit