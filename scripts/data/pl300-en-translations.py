# -*- coding: utf-8 -*-
TR = {}

def add(_id, q, e):
    TR[_id] = {"q": q, "e": e}

# ---------- TOPIC 326 - Preparazione dati con Power BI ----------

add("21563",
'''A folder receives CSV files with the same schema every month. Which connector automatically picks up future files as well?''',
'''The Folder connector combines all compatible files found in the path and applies the same transformation function to any new files. The Text/CSV connector, by contrast, connects to a single file only.''')

add("21564",
'''A staging query needs to feed other queries but must not create a table in the model. What should you do?''',
'''Turning off "Enable load" keeps the query available for other queries to reference without materializing it in the model. "Include in report refresh" controls whether the query is refreshed, not whether it is loaded.''')

add("21565",
'''You need to merge Sales and Customers, keeping all Sales rows and only the matching Customers rows. Which join do you use?''',
'''A left outer join keeps all rows from the left table and adds matching values from the right table. An inner join would drop sales that have no matching customer.''')

add("21566",
'''After a merge, you want to find the Sales keys that have no match in Customers. Which join type is the most direct?''',
'''A left anti join returns only the left-table rows that have no match. It's useful for referential integrity checks.''')

add("21567",
'''Column headers contain month names such as Jan, Feb, and Mar, with sales values in the cells. Which transformation produces Month-Value rows?''',
'''Unpivot columns turns repeated columns into attribute-value pairs, creating a structure suited to analysis. Pivot performs the opposite operation.''')

add("21568",
'''You import a sheet where the first row contains the actual field names. Which step do you apply?''',
'''"Use First Row as Headers" assigns the first row's values as column names. Type detection does not change the headers.''')

add("21569",
'''A product code needs to keep its leading zeros and will only be used as a key. Which data type do you choose?''',
'''A code is an identifier, not a quantity, so the Text type preserves leading zeros. A numeric type could strip them and invite inappropriate aggregation.''')

add("21570",
'''DateTime.LocalNow() changes on every refresh, and you want it evaluated only once during query execution. Which M function is suitable?''',
'''Buffering can stabilize the evaluation of an expression for the duration of that execution. It should be used judiciously, since it can also break query folding and increase memory use.''')

add("21571",
'''A transformation against SQL Server should ideally be executed by the database itself. Which indicator do you check in Power Query?''',
'''Query folding translates M steps into operations executed by the source. The native query view, or its related indicators, helps you verify up to which step folding occurs.''')

add("21572",
'''Which ordering favors query folding and reduces the data transferred from a relational source?''',
'''Applying foldable filters and column selections early reduces rows and columns right at the source. A local index step can break folding, and DAX only acts after the data has been loaded.''')

add("21573",
'''A column contains some Error values, and you want to keep those rows aside for separate analysis. Which action do you choose?''',
'''Keeping errors in a diagnostic query makes the affected records and their causes visible. Replacing them with zero could distort the meaning of the data.''')

add("21574",
'''You need to create a reusable function starting from a query that imports a sample file. What's the key step?''',
'''A parameterized M function applies the same logic to different inputs, such as the binary content of each file. DAX does not operate at the import stage.''')

add("21575",
'''Two tables have the same columns and represent sales from different regions. How do you consolidate them?''',
'''Append stacks rows from tables with a compatible schema. Merge, by contrast, adds columns based on a key.''')

add("21576",
'''A FullName column contains 'Rossi, Anna'. You want to get Last Name and First Name without using DAX. What do you use?''',
'''Splitting the column by the comma delimiter creates two columns during data preparation. This is more appropriate than model-side logic when the data needs to be normalized before loading.''')

add("21577",
'''You need to replace null Category values with the last non-null value above them in a hierarchical file. Which transformation do you use?''',
'''Fill Down propagates the previous valid value into the following null cells. Fill Up would instead use the next value below.''')

add("21578",
'''An Environment parameter needs to switch the server name between development and production. What's the main advantage?''',
'''Parameters separate configuration from M logic, making it easier to move between environments. They do not configure security or service connectivity.''')

add("21579",
'''You want to profile the entire dataset, not just the first 1,000 rows shown in the Editor. What do you set?''',
'''Power Query can calculate column quality, distribution, and profile over the entire dataset. The default preview-based setting can hide issues that occur beyond the first rows.''')

add("21580",
'''A column imported as Any contains both numbers and text. Why is it worth assigning an explicit data type?''',
'''An explicit type defines which operations are valid and surfaces incompatible values. The Any type postpones the ambiguity and can produce unexpected results.''')

add("21581",
'''You need to aggregate order rows by Customer, calculating the total amount and order count, before loading the data. Which transformation do you use?''',
'''Group By produces one row per key and can calculate multiple aggregations at once. It's useful when row-level detail isn't needed in the model.''')

add("21582",
'''Customer names contain small spelling errors, and you want to suggest matches against a reference list. Which feature do you consider?''',
'''Fuzzy matching compares similar text and lets you set a similarity threshold. Matches should still be validated to avoid false positives.''')

add("21583",
'''A referenced query needs to inherit all the steps of the staging query and update whenever it changes. What do you choose?''',
'''Reference creates a new query based on the output of the original query. Duplicate, by contrast, creates an independent copy of the existing steps.''')

add("21584",
'''A column contains JSON text coming from an API. How do you expose its attributes?''',
'''Power Query can parse the JSON text into records/lists and then expand them into columns. Changing the data type or using DAX does not structure the payload at import time.''')

add("21585",
'''You need to combine two key columns while avoiding collisions such as 1+23 and 12+3. Which approach is safer?''',
'''A delimited, type-aware concatenation avoids indistinguishable combinations; a surrogate key is often even more robust. Plain concatenation can create collisions.''')

add("21586",
'''After filtering a table, you want to number the rows in their current order. Which transformation do you use?''',
'''An index column assigns a sequence based on the current row order. If the order matters, you should sort the table explicitly beforehand.''')

add("21587",
'''A calendar table is generated in Power Query. Which pair of M functions is typically used?''',
'''List.Dates generates the sequence of dates, and Table.FromList converts it into a table. CALENDAR is a DAX function, not an M function.''')

add("21588",
'''You want to prevent a control query from refreshing in the service while still keeping it in the file. Which property do you change?''',
'''The "Include in report refresh" property determines whether the query is re-executed. "Enable load", by contrast, controls whether the result becomes part of the model.''')

add("21589",
'''What risk does setting all sources to Public in the privacy levels create?''',
'''The privacy firewall limits data leakage between sources. Marking a sensitive source as Public can allow inappropriate combinations of data.''')

add("21590",
'''A file has title rows before the real header row. Which sequence is correct?''',
'''You should first remove the extraneous rows, then promote the correct row as headers. Reversing the order produces incorrect column names.''')

add("21591",
'''A Date column contains values in Italian culture format, but the machine uses English culture. How do you avoid misinterpretation?''',
'''Changing the type using a specific locale (Italian) interprets day, month, and separators according to that culture. FORMAT acts after loading and returns text, not a proper date type.''')

add("21592",
'''Why is a centralized staging query preferable to repeating the same steps across five queries?''',
'''A staging query creates a single point of ingestion and cleanup that the final queries can reference. This limits divergence and duplicated work.''')

# ---------- TOPIC 327 - Modellazione dati e DAX ----------

add("21593",
'''In a star schema, where do you normally place Quantity and SalesAmount?''',
'''Additive measures belong in the fact table, at the grain of the business event. Dimensions describe who, what, where, and when.''')

add("21594",
'''A Product dimension has one row per product, while Sales has many rows per product. Which cardinality do you set?''',
'''One-to-many from Product to Sales: the unique key sits on the "one" side of the dimension, with repeated occurrences on the "many" side of the fact table. Filters normally flow from the dimension to the facts.''')

add("21595",
'''Two fact tables share Date and Product. How do you model them while avoiding a direct many-to-many relationship?''',
'''Conformed dimensions filter both fact tables consistently. A direct relationship between the two fact tables creates ambiguity and results that are hard to predict.''')

add("21596",
'''When is a bridge table appropriate?''',
'''A bridge table represents associations, for example multiple salespeople per customer, and connects to the related entities through controlled relationships. It's not a generic catch-all container.''')

add("21597",
'''A relationship must be used by only one specific measure because an active path already exists. What do you do?''',
'''Keep the relationship inactive and activate it inside the measure with USERELATIONSHIP, which turns on the specified relationship during CALCULATE without introducing ambiguous active paths in the model.''')

add("21598",
'''Sales has OrderDate and ShipDate, both related to the same Date table. Which design makes independent, simultaneous filtering easier?''',
'''Role-playing date dimensions, one per role, make each date's role explicit and allow independent slicers. A single dimension with one inactive relationship is fine when you don't need to filter on both dates at once.''')

add("21599",
'''Why is it worth hiding technical keys and sort-order columns from the report view?''',
'''Hiding technical fields simplifies the report-authoring experience; relationships and sort orders continue to use them behind the scenes.''')

add("21600",
'''A Category column must follow the order Low, Medium, High. How do you configure the model?''',
'''Create a numeric sort-order column and use "Sort by Column", which ties the label to a stable ordering value. Alphabetical order does not represent the business sequence.''')

add("21601",
'''What is the essential requirement for marking a table as a date table?''',
'''The date column must identify each day exactly once and cover the range without gaps. This is what properly supports the standard time intelligence functions.''')

add("21602",
'''You need to calculate a total sales figure that reacts to slicers and filters. Which object do you choose?''',
'''A measure, such as SUM(Sales[Amount]), is evaluated within the filter context of the cell or visual. A calculated column is materialized at refresh time and does not recalculate the total for each selection.''')

add("21603",
'''You need to classify each order row as "Large" when Amount > 1000, and use that class in a slicer. What do you choose?''',
'''A calculated column: a per-row category used as an axis or slicer must be a materialized column. A measure returns values within a context, but it doesn't create selectable row-level categories.''')

add("21604",
'''In a calculated column, why can you write Sales[Quantity] * Sales[Price]?''',
'''Because row context exists: calculated columns are evaluated row by row, so column references read from the current row. This is row context, distinct from filter context.''')

add("21605",
'''What is the main effect of CALCULATE in a DAX measure?''',
'''It evaluates an expression within a modified filter context. CALCULATE adds, replaces, or removes filters before evaluating the expression, making it the central function for controlling context in DAX.''')

add("21606",
'''A measure needs to calculate sales of red products while preserving any color filter already selected. Which construct do you use?''',
'''CALCULATE with KEEPFILTERS(Product[Color] = "Red"): KEEPFILTERS intersects the new filter with the existing one instead of replacing it. REMOVEFILTERS and ALL would remove filters instead.''')

add("21607",
'''You want a percentage of the category total that ignores the current product but keeps the other filters. Which function is suitable?''',
'''REMOVEFILTERS(Product[Product]) in the denominator: removing only the product filter preserves category, date, and other context. Removing all filters would produce a different, global denominator.''')

add("21608",
'''What's the practical difference between SUM and SUMX?''',
'''SUM aggregates a single column, while SUMX evaluates an expression row by row over a table. SUMX is an iterator that creates row context over the iterated table, useful for Quantity * Price; SUM simply reads directly from one numeric column.''')

add("21609",
'''The measure Revenue = SUMX(Sales, Sales[Quantity] * RELATED(Product[Price])) uses RELATED because it needs to retrieve a value from the "one" side through an existing relationship.''',
'''RELATED follows a many-to-one relationship from the current row and returns the related value. It requires row context and a valid relationship.''')

add("21610",
'''You want to count distinct customers who made at least one sale in the current context. Which expression is the most direct?''',
'''DISTINCTCOUNT(Sales[CustomerID]): DISTINCTCOUNT on the key in the fact table only counts customers that remain after filters are applied. COUNTROWS(Customers) can include customers with no sales, depending on context.''')

add("21611",
'''A measure needs to return 0 instead of BLANK when there are no sales. Which function do you use?''',
'''COALESCE([Sales], 0): COALESCE returns the first non-blank argument. It's clearer than indiscriminately adding zero, and it preserves the measure's logic.''')

add("21612",
'''You want to avoid a division-by-zero error in a Margin % measure. Which function do you choose?''',
'''DIVIDE([Margin], [Revenue]): DIVIDE handles zero or blank denominators and can return an alternative result. The / operator can produce unwanted results in these cases.''')

add("21613",
'''A measure must display a value only when a single year is selected. Which check do you use?''',
'''HASONEVALUE(Date[Year]): HASONEVALUE checks whether the context contains exactly one distinct value. SELECTEDVALUE can then retrieve it or return an alternative.''')

add("21614",
'''What does SELECTEDVALUE(Product[Category], "Multiple categories") return?''',
'''The single category in context, or the alternative text otherwise: SELECTEDVALUE is conceptually equivalent to checking for a single value and returning it; with zero or multiple values, it returns the alternative.''')

add("21615",
'''For a year-bounded running total, you want to include all dates up to the current one without crossing into the next year. Which pattern do you use?''',
'''CALCULATE with a date filter that keeps the Year context in place: a running total modifies the date filter to include prior dates, but it must still respect the year boundary. A plain SUM does not extend the period at all.''')

add("21616",
'''Why does TOTALYTD require a correctly marked date table and a date column?''',
'''It needs to determine the ordered set of dates from the start of the year to the current context: time intelligence relies on a consistent calendar to build these date ranges. Duplicate or missing dates can make the calculation unreliable.''')

add("21617",
'''The fiscal year ends on June 30. How do you communicate this to TOTALYTD?''',
'''By using the appropriate year_end_date argument: TOTALYTD can take the fiscal year-end date so the range no longer matches the calendar year. The relationship remains date-based.''')

add("21618",
'''You want to compare sales against the same period last year. Which function is suitable on a regular calendar?''',
'''SAMEPERIODLASTYEAR shifts the current context's set of dates back by one year. It requires a reliable date table.''')

add("21619",
'''DATEADD returns an error because the selected set of dates isn't contiguous. What's the more robust model-level fix?''',
'''Use a continuous calendar table connected to the facts: classic time-shifting functions require an uninterrupted set of dates. A calendar dimension avoids the gaps present when dates come only from sales days.''')

add("21620",
'''Which function creates a virtual table with one row per customer and a calculated Sales column?''',
'''ADDCOLUMNS(VALUES(Customers[CustomerID]), "Sales", [Sales]): VALUES produces the list of customers in context, and ADDCOLUMNS evaluates the measure for each row. The resulting table can be used by iterators without materializing it in the model.''')

add("21621",
'''You want to rank products by sales within the currently selected context. Which function do you use?''',
'''RANKX over ALLSELECTED(Product[Product]): RANKX compares the expression across the rows of the supplied table. ALLSELECTED keeps the outer selections while removing the single-row product filter.''')

add("21622",
'''Why can a high-precision timestamp column compress poorly in VertiPaq?''',
'''It has high cardinality, often close to one distinct value per row: columnar compression benefits from repeated values. Splitting date and time, or removing unnecessary precision, can reduce cardinality.''')

add("21623",
'''Which change typically reduces model size without changing the analysis?''',
'''Removing unused, high-cardinality columns: VertiPaq stores every column, so removing unneeded ones reduces dictionaries and segments. High-cardinality strings, on the other hand, tend to take up more space.''')

add("21624",
'''A bidirectional relationship creates two filter paths between the same tables. What's the risk?''',
'''Ambiguity and hard-to-predict filtering results: multiple paths can make it unclear how a filter reaches a table. A single direction is preferred unless there's a verified need for both.''')

add("21625",
'''In a one-to-many relationship, which filter direction is normally preferred in a star schema?''',
'''From the dimension on the "one" side to the facts on the "many" side: filtering this way supports predictable slicers and aggregations. Bidirectional filtering should only be introduced when the use case genuinely requires it.''')

add("21626",
'''A key in the dimension table contains unexpected duplicates. What happens to the intended one-to-many relationship?''',
'''It can't use that column as the "one" side until the values are made unique. The "one" side must have unique values, so you need to fix the grain or build a dimension with exactly one row per key.''')

add("21627",
'''A measure's total doesn't match the sum of the visible rows. Is this necessarily an error?''',
'''No, the measure is re-evaluated in the filter context of the total. Every cell, including the total, has its own context, so non-additive measures like percentages or distinct customer counts don't have to equal the sum of the rows.''')

add("21628",
'''You want to temporarily force a relationship not to propagate filters within a measure. Which function do you use?''',
'''CROSSFILTER with NONE inside CALCULATE: CROSSFILTER changes the relationship's filtering behavior only for the duration of the evaluation, and NONE disables propagation for that measure.''')

add("21629",
'''In which DAX scenario is the TREATAS function particularly useful?''',
'''When you want to apply the values from one table as a filter on columns that aren't physically related: TREATAS creates a virtual relationship within the calculation by applying a set of values to target columns. It's useful for disconnected tables and controlled scenarios.''')

add("21630",
'''A Discount Parameter table is disconnected from the model. How does a measure use the selected value?''',
'''It reads the value with SELECTEDVALUE and applies it in the calculation: parameter tables can remain disconnected, and the measure retrieves the chosen value and incorporates it into the expression.''')

add("21631",
'''What's the advantage of a base measure [Sales] that's reused by YTD and YoY measures?''',
'''It centralizes the logic and keeps derived calculations consistent: measure branching reduces duplication and makes maintenance and testing easier. Derived measures retain the semantics of the base measure.''')

add("21632",
'''A measure uses FILTER(Sales, Sales[Amount] > 100) as a CALCULATE argument. When is a direct Boolean filter preferable?''',
'''When the condition involves a single column and doesn't require complex table logic: direct Boolean filters are often more efficient and readable. FILTER remains necessary for conditions that require iteration or more complex logic.''')

add("21633",
'''Which function returns the related fact-table rows from the current row of a dimension?''',
'''RELATEDTABLE: it follows the relationship and returns a table of related rows, which can be used with, for example, COUNTROWS. RELATED, by contrast, returns a single value from the "one" side.''')

add("21634",
'''LOOKUPVALUE finds multiple rows with different results for the same key. What's the problem?''',
'''The lookup key does not identify a unique result: LOOKUPVALUE requires the criteria to lead to a single, consistent value. It's better to fix the uniqueness issue or model a proper relationship instead.''')

# ---------- TOPIC 328 - Visualizzazione dati e dashboard ----------

add("21635",
'''Which visual do you choose to show the monthly trend of sales over time?''',
'''A line chart makes trends, changes, and seasonality easy to read along a time axis. A pie chart with many time-based categories is hard to compare.''')

add("21636",
'''You need to compare actual sales against target across five regions. Which visual is effective?''',
'''A clustered bar chart: side-by-side bars let you compare two values on the same scale for each region. A card doesn't show a comparison across categories.''')

add("21637",
'''You want to show the percentage breakdown of three categories that add up to the total. Which visual might be appropriate?''',
'''A donut chart, as long as the number of categories stays small: it can communicate parts of a whole with a few clearly distinct categories. With many categories, sorted bars are preferable.''')

add("21638",
'''Which visual highlights the relationship between advertising spend and revenue, while also encoding market size?''',
'''A scatter chart with bubble size: it compares two quantitative measures and can encode a third in the bubble size, making correlations and outliers visible.''')

add("21639",
'''You need to show a single KPI with its current value, target, and trend direction. Which visual do you choose?''',
'''The KPI visual, since it combines the indicator, target, and trend axis in one place. A plain card shows the value but doesn't offer the same context.''')

add("21640",
'''You want to let users switch between Revenue, Margin, and Quantity in the same chart without using bookmarks. What do you use?''',
'''A field parameter: field parameters let you dynamically swap the measures or dimensions being displayed, without duplicating the visual.''')

add("21641",
'''A Region slicer needs to filter a chart but not a global-target card. What do you configure?''',
'''Edit interactions, setting the card to None: Edit interactions controls how a source visual affects each visual on the page. The relationship itself can remain correct for the rest of the model.''')

add("21642",
'''When you click a bar, you want another chart to show its internal breakdown without removing the other categories. Which interaction do you choose?''',
'''Cross-highlighting: it keeps the overall context visible and highlights the selected portion, whereas cross-filtering would show only the filtered data.''')

add("21643",
'''A Year > Quarter > Month hierarchy needs to expand all categories of one level while keeping the previous level. Which command do you use?''',
'''"Expand all down one level": it adds the next level's detail for every member while keeping the hierarchical context. "Go to next level" replaces the displayed level instead.''')

add("21644",
'''What's the requirement for a drill-through page on Customer?''',
'''Adding Customer to the destination page's drill-through filters: the field in the drill-through well defines the context carried over from the source selection. The destination page can then show details filtered by that customer.''')

add("21645",
'''You want a tooltip page to show contextual details when hovering over a point on a chart. What do you configure?''',
'''A page with the Tooltip page size, set as a report page tooltip and linked to the visual: a report page tooltip receives the context of the hovered point and can contain multiple visuals. It must be configured as a tooltip and associated with the visual.''')

add("21646",
'''A bookmark needs to change the layout without clearing the current slicer selections. Which property do you disable?''',
'''Data: if Data is included, the bookmark stores filters and slicer selections. Excluding it lets you preserve the current selection state while still changing visibility and layout.''')

add("21647",
'''To build a menu that shows or hides a custom filter panel, which features do you combine?''',
'''The Selection pane, bookmarks, and buttons: the Selection pane controls visibility, bookmarks save the states, and buttons navigate between them. No model changes are needed.''')

add("21648",
'''You want to keep the same Date slicer synchronized across three pages. What do you use?''',
'''Sync slicers: it replicates the selection across pages and lets you decide where the slicer itself is visible, avoiding inconsistent, independent slicers.''')

add("21649",
'''A report has many slicers, and you want to offer a "Reset filters" button. What's the simplest pattern?''',
'''A bookmark with the default state, linked to a button: a bookmark that includes Data can store the initial state, and the button restores it. It needs to be updated whenever the default configuration changes.''')

add("21650",
'''How do you reduce label clutter in a column chart with many categories?''',
'''Show fewer categories, sort meaningfully, and rely on tooltips for detail: a focused selection and meaningful sorting improve readability, while tooltips keep the detail available on demand.''')

add("21651",
'''For users with color blindness, which choice improves accessibility?''',
'''Sufficient contrast and indicators that don't rely on color alone: color, labels, shapes, and contrast all need to communicate together. Relying only on red/green can make the meaning inaccessible.''')

add("21652",
'''What is the tab order in the Selection pane used for?''',
'''It defines the keyboard navigation sequence between objects: a logical tab order makes the report usable with a keyboard and assistive technologies. It has no effect on data sorting.''')

add("21653",
'''What makes for better alt text on a chart?''',
'''A concise description of the purpose and the key takeaway: meaningful alt text explains what the visual shows and why it matters. It shouldn't needlessly replicate thousands of individual values.''')

add("21654",
'''A title needs to display the selected year. How do you make it dynamic?''',
'''A DAX measure used with conditional formatting on the title: a measure can concatenate SELECTEDVALUE with the title text and react to context. Conditional formatting then links the measure to the title property.''')

add("21655",
'''You want to color negative margin red and positive margin green based on business thresholds. What do you use?''',
'''Conditional formatting based on rules or a measure: rules or a color measure apply repeatable thresholds to the visual. It's worth pairing this with icons or text for accessibility.''')

add("21656",
'''Which visual supports rows, columns, hierarchies, and cross-tabulated subtotals?''',
'''The matrix: it organizes aggregations along two axes and supports hierarchical expansion and subtotals. A table, by contrast, is flat.''')

add("21657",
'''You need to analyze which factors explain a high Returns value, with the split points chosen automatically. Which visual do you evaluate?''',
'''The decomposition tree: it allows hierarchical exploration and can suggest high/low splits automatically. It's well suited to interactive root-cause exploration.''')

add("21658",
'''You want Power BI to suggest factors associated with customers whose Churn is Yes. Which visual is specifically designed for this?''',
'''Key influencers: it analyzes the factors that increase the likelihood of a categorical outcome, or that influence a continuous metric.''')

add("21659",
'''Which visual shows how increases and decreases bridge a starting value to an ending value?''',
'''A waterfall chart: it exposes positive and negative contributions and their cumulative effect, useful for profit or budget variances.''')

add("21660",
'''You need to show the stages Lead > Opportunity > Order with decreasing quantities. Which visual do you choose?''',
'''A funnel chart: it communicates volumes across sequential stages and makes drop-off rates visible. It doesn't necessarily represent a time series.''')

add("21661",
'''A map uses ambiguous city names. How do you improve the geocoding?''',
'''Add State/Country and set the geographic data categories: geographic context and data categories help the service tell apart places that share a name. Explicit coordinates are even more reliable when available.''')

add("21662",
'''For sensitive data, what's a risk of maps that send location data to an external service?''',
'''Geographic information may be transmitted to the map provider: governance needs to consider where geographic data is processed. Aggregated coordinates or alternative visuals can be used depending on policy.''')

add("21663",
'''A report needs to adapt to a smartphone screen with a specific order for the visuals. What do you create?''',
'''A mobile layout: it arranges existing visuals on a canvas optimized for phones, without duplicating the model.''')

add("21664",
'''Which tool helps identify a slow visual and break down time between the DAX query and rendering?''',
'''Performance Analyzer: it records the duration of each visual and separates query time, visual rendering, and other costs. The results guide targeted optimizations.''')

add("21665",
'''One visual takes a long time while the others are fast. What's the first diagnostic step?''',
'''Record the interaction with Performance Analyzer and copy the query: measuring first identifies whether the cost is in the DAX query or in rendering. Structural changes made without evidence can make the problem worse.''')

add("21666",
'''You want to allow natural-language questions, but a business term doesn't match the column name. What do you configure?''',
'''Synonyms in the Q&A model: synonyms link business vocabulary to model fields and improve how Q&A interprets questions.''')

add("21667",
'''The "Analyze: explain the increase" feature is most useful when?''',
'''To automatically explore possible contributors to a selected variation: Analyze uses the context of the selected point to search for dimensions that might explain the increase or decrease. Its conclusions should still be validated.''')

add("21668",
'''Which filter scope restricts all pages of a report?''',
'''A report-level filter: report-level filters apply to every page. Page-level and visual-level filters have narrower scopes.''')

add("21669",
'''You want to show only the ten top-selling products. Which filter do you use?''',
'''A Top N filter on Product, using the Sales measure as the value: Top N ranks categories by a measure and keeps the requested count. You need to specify the "By value" measure and apply the filter.''')

add("21670",
'''A date filter must always show the last 30 days relative to the current date. Which filter type do you choose?''',
'''A relative date filter: it automatically updates the time window. An absolute date range would require ongoing manual maintenance.''')

# ---------- TOPIC 329 - Deployment, sicurezza e Power BI Service ----------

add("21671",
'''An Import-mode model uses an on-premises SQL Server and needs to refresh in the service. What's normally required?''',
'''A configured on-premises data gateway, with the source and credentials set up: the service uses the gateway to securely reach the private source. Desktop does not need to stay open for a scheduled refresh.''')

add("21672",
'''What's the advantage of a gateway cluster over a single gateway?''',
'''High availability and load balancing of requests: multiple members in the cluster reduce the single point of failure and can distribute the load. Data sources and credentials still need to be configured.''')

add("21673",
'''A semantic model uses only a supported, publicly accessible cloud source. Is an on-premises gateway always required?''',
'''No, the service can often connect directly using cloud credentials. Many cloud sources are reached directly by the Power BI service; a gateway is needed when the network or the connector requires a bridge.''')

add("21674",
'''You want each manager to see only the rows for their own area, based on their sign-in account. Which pattern do you use?''',
'''Dynamic RLS with USERPRINCIPALNAME() and a mapping table: the mapping table ties identity to areas, and the RLS rule dynamically filters the model. A report-level filter can be removed by the user and is not a security measure.''')

add("21675",
'''Why do you need to test RLS together with the model's relationships and measures?''',
'''Because filter propagation can produce visibility different from what's expected: RLS enters the filter context and follows relationships. Incorrect paths, bridge tables, or measures that remove filters all deserve testing with "View as role".''')

add("21676",
'''A user is a workspace Admin and also belongs to an RLS role. What behavior should you take into account?''',
'''Elevated workspace roles are not restricted by RLS the way Viewers are: RLS protects consumers, but Admin, Member, and Contributor have editing privileges and shouldn't be treated as restricted recipients. Viewer or an app is normally used for consumers instead.''')

add("21677",
'''Which workspace role lets users view content without editing it and is suitable for consumers subject to RLS?''',
'''Viewer: it's the read-only role and respects RLS on the semantic model. The other roles all include some management or editing capability.''')

add("21678",
'''You need to distribute curated content to many users without adding them all as workspace members. What do you publish?''',
'''A Power BI app from the workspace: the app offers a controlled package for consumers and separates distribution from workspace collaboration. It can be updated once the content is ready.''')

add("21679",
'''What's the main risk of Publish to Web?''',
'''It makes the report publicly accessible without authentication: Publish to Web is intended for public data, so anyone with the link can access it, and the content can be indexed or shared further.''')

add("21680",
'''A deployment pipeline needs to promote content from development to test and production. How do you handle different servers?''',
'''With deployment rules or parameters tied to each environment: deployment rules and parameters let you swap connections while keeping the same logical artifact, reducing the risk of manual changes.''')

add("21681",
'''After publishing a new app version, do users automatically see workspace changes that haven't been included yet?''',
'''No, the app needs to be updated and republished: workspace and app have separate lifecycles, so authors prepare changes and then update the app to distribute them to consumers.''')

add("21682",
'''You want to certify a semantic model as an authoritative organizational source. Which governance feature do you use?''',
'''Certified endorsement, following the organization's process: certification signals that the artifact has passed the governance process. Promoted is a lighter, often self-managed endorsement.''')

print("Loaded", len(TR), "translations")