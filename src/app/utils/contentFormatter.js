/**
 * Formats and processes content blocks from Strapi
 */

/**
 * Processes a hero section content
 * @param {Object} hero - The hero section data
 * @returns {Object} Processed hero content
 */
export const processHeroContent = (hero) => {
  if (!hero) return null;

  return {
    title: hero.title || '',
    subtitle: hero.subtitle || '',
    intro: Array.isArray(hero.intro) 
      ? hero.intro.map(block => ({
          text: block.children?.[0]?.text || '',
          type: block.type || 'paragraph',
          style: block.style || 'normal'
        }))
      : []
  };
};

/**
 * Processes a sections content
 * @param {Object} sections - The sections data
 * @returns {Object} Processed sections content
 */
export const processSectionsContent = (sections) => {
  if (!sections) return null;

  return {
    title: sections.title || '',
    subtitle: sections.subtitle || '',
    body: Array.isArray(sections.body)
      ? sections.body.map(block => {
          // Handle list items specially
          if (block.type === 'list') {
            return {
              type: block.type,
              format: block.format,
              children: block.children?.map(item => ({
                type: item.type,
                text: item.children?.[0]?.text || ''
              })) || []
            };
          }
          
          // Handle paragraphs and headings
          return {
            type: block.type || 'paragraph',
            text: block.children?.[0]?.text || '',
            level: block.level, // For headings
            children: block.children?.map(child => ({
              type: child.type,
              text: child.text || '',
              bold: child.bold || false
            })) || []
          };
        })
      : []
  };
};

/**
 * Processes services content
 * @param {Array} services - The services array
 * @returns {Array} Processed services content
 */
export const processServicesContent = (services) => {
  if (!Array.isArray(services)) return [];

  return services.map(service => ({
    id: service.id,
    title: service.title || '',
    description: service.description || ''
  }));
};

/**
 * Determines the appropriate element type based on block type and style
 * @param {Object} block - The content block
 * @returns {string} HTML element type
 */
export const getElementType = (block) => {
  if (!block) return 'p';

  const { type, style } = block;
  
  switch (type) {
    case 'heading':
      switch (style) {
        case 'h1': return 'h1';
        case 'h2': return 'h2';
        case 'h3': return 'h3';
        case 'h4': return 'h4';
        default: return 'h2';
      }
    case 'list':
      return style === 'ordered' ? 'ol' : 'ul';
    case 'quote':
      return 'blockquote';
    default:
      return 'p';
  }
};

/**
 * Renders content blocks with appropriate HTML elements
 * @param {Array} blocks - Array of content blocks
 * @param {Object} styles - CSS module styles object
 * @returns {Array} Array of JSX elements
 */
export const renderContentBlocks = (blocks, styles = {}) => {
  if (!Array.isArray(blocks)) return [];

  return blocks.map((block, index) => {
    if (block.type === 'list') {
      const ListType = block.format === 'ordered' ? 'ol' : 'ul';
      return (
        <ListType key={index} className={styles[ListType] || ''}>
          {block.children.map((item, i) => (
            <li key={i}>{item.text}</li>
          ))}
        </ListType>
      );
    }

    if (block.type === 'heading') {
      const HeadingType = `h${block.level || 2}`;
      return (
        <HeadingType key={index} className={styles[HeadingType] || ''}>
          {block.text}
        </HeadingType>
      );
    }

    // Handle paragraphs with potential bold text
    if (block.children && block.children.length > 0) {
      return (
        <p key={index} className={styles.p || ''}>
          {block.children.map((child, i) => 
            child.bold ? <strong key={i}>{child.text}</strong> : child.text
          )}
        </p>
      );
    }

    // Fallback for simple text blocks
    const ElementType = getElementType(block);
    return (
      <ElementType key={index} className={styles[ElementType] || ''}>
        {block.text}
      </ElementType>
    );
  });
};

/**
 * Validates and processes page data
 * @param {Object} page - The page data object
 * @returns {Object} Processed page content
 */
export const processPageContent = (page) => {
  if (!page) return null;

  return {
    hero: processHeroContent(page.Hero),
    sections: processSectionsContent(page.Sections),
    services: processServicesContent(page.Services)
  };
}; 