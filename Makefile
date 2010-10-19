test:
	@expresso -I lib
test-cov:
	@expresso -I lib --coverage


.PHONY: test test-cov
