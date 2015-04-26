TARGET = week3
TEXFILES = $(TARGET).tex

$(TARGET).pdf: $(TEXFILES) TODO
	pdflatex $(TARGET)
	pdflatex $(TARGET)

TODO: $(TEXFILES)
	grep -n TODO: *.tex > TODO
	
clean:
	rm -f *.aux *.bbl *.blg *.log *.nav *.out *.snm *.toc *.vrb $(TARGET).dvi $(TARGET).ps 

cleanall:
	rm -f *.aux *.bbl *.blg *.log *.nav *.out *.snm *.toc *.vrb $(TARGET).dvi $(TARGET).ps $(TARGET).pdf
