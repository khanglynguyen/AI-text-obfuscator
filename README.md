# AI-text-obfuscator
just a simple idea which was executed by Claude
inspiration: a post from Twitter
https://x.com/socoloffalex/status/2056969736391372927?s=46
A program that obfuscates text display while keeping it human-readable

A Text Obfuscator app with 8 different obfuscation methods

Key Features:

Obfuscation Techniques:

	1.	Unicode Lookalikes - Replaces Latin letters with identical-looking Cyrillic characters (a→а, e→е)
	2.	Zero-Width Characters - Hides data in invisible Unicode control characters
	3.	Character Code Offset - ROT13-style shifting that’s hard for AI to reverse
	4.	HTML Entity Mix - Mixes encoded and decoded characters randomly
	5.	RTL + Encoding - Combines right-to-left marks with character shifting
	6.	Combining Characters - Adds invisible diacritical marks that distort recognition
	7.	Base64 Hybrid - Encodes then inserts zero-width separators
	8.	Homoglyph Mix - Replaces with visually similar but different Unicode variants

How It Works:

	•	Text remains visually readable to humans
	•	The underlying data structure becomes unrecognizable to AI systems
	•	Choose your preferred method, paste text, click “Obfuscate,” and copy the result
	•	“Show Raw” lets you see the actual character codes and structure

Design:

	•	Dark, tech-forward aesthetic (blue/cyan accents on slate background)
	•	Smooth animations and hover effects
	•	Real-time feedback and easy copying
	•	Information section explaining each technique

The obfuscated text will display normally to you but will confuse automated text analysis and large language models trying to read it.
