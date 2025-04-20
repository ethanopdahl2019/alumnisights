
import { supabase } from '@/integrations/supabase/client';
import type { LandingPage, LandingPageTemplate, ContentBlock } from '@/types/database';

export async function getLandingPageTemplates(): Promise<LandingPageTemplate[]> {
  // Mock data until database tables are created
  return [
    {
      id: '1',
      name: 'School Profile',
      slug: 'school-profile',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Major Profile',
      slug: 'major-profile',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'School + Major Combination',
      slug: 'school-major-combo',
      created_at: new Date().toISOString()
    }
  ];
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  // Mock data until database tables are created
  const pages = [
    {
      id: '1',
      template_id: '3',
      slug: 'harvard-economics',
      title: 'Economics at Harvard',
      school_id: '1',
      major_id: '1',
      meta_title: 'Economics at Harvard University | Student Insights',
      meta_description: 'Learn what it\'s like to study Economics at Harvard University from current students and alumni.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      template: {
        id: '3',
        name: 'School + Major Combination',
        slug: 'school-major-combo',
        created_at: new Date().toISOString()
      },
      school: {
        id: '1',
        name: 'Harvard University',
        location: 'Cambridge, MA',
        type: 'ivy_league' as const  // Fixed type error by specifying literal type
      },
      major: {
        id: '1',
        name: 'Economics',
        category: 'Social Sciences'
      },
      content_blocks: [
        {
          id: '1',
          type: 'school' as const,  // Fixed type error by specifying literal type
          title: 'About Harvard University',
          content: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts...',
          school_id: '1',
          major_id: null,
          order_position: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'major' as const,  // Fixed type error by specifying literal type
          title: 'Economics at Harvard',
          content: 'The Economics Department at Harvard is one of the most prestigious in the world...',
          school_id: null,
          major_id: '1',
          order_position: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          type: 'general' as const,  // Fixed type error by specifying literal type
          title: 'Career Opportunities',
          content: 'Economics graduates from Harvard have gone on to work in various fields...',
          school_id: null,
          major_id: null,
          order_position: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }
  ];
  
  return pages.find(page => page.slug === slug) || null;
}

export async function getContentBlocks(schoolId?: string, majorId?: string): Promise<ContentBlock[]> {
  // Mock data until database tables are created
  return [
    {
      id: '1',
      type: 'school',
      title: 'About Harvard University',
      content: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts...',
      school_id: '1',
      major_id: null,
      order_position: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      type: 'major',
      title: 'Economics at Harvard',
      content: 'The Economics Department at Harvard is one of the most prestigious in the world...',
      school_id: null,
      major_id: '1',
      order_position: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ].filter(block => {
    if (schoolId && majorId) {
      return block.school_id === schoolId || block.major_id === majorId;
    } 
    if (schoolId) {
      return block.school_id === schoolId;
    }
    if (majorId) {
      return block.major_id === majorId;
    }
    return true;
  });
}
