import { Github, Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: "https://x.com/rset_iedc", label: "Twitter" },
    { icon: Facebook, href: "https://www.facebook.com/iedc.rset/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/rsetiedc/", label: "Instagram" },
    { icon: Linkedin, href: "https://in.linkedin.com/company/rset-iedc", label: "LinkedIn" }
  ];

  return (
    <footer id="footer" className="relative py-16 border-t border-border">
      <div className="container px-6">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <p className="font-mono text-foreground mb-1">Abraham Manoj</p>
              <p className="font-mono text-sm text-muted-foreground">Phone: +91 70120 79459</p>
              <p className="font-mono text-sm text-muted-foreground">Email: abrahammadamana@gmail.com</p>
            </div>
            <div>
              <p className="font-mono text-foreground mb-1">Fathima Moonam Kandathil</p>
              <p className="font-mono text-sm text-muted-foreground">Phone: +91 80895 98331</p>
              <p className="font-mono text-sm text-muted-foreground">Email: fathimarasheed004@gmail.com</p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-6">
            <img className="w-40" src="/images/rset_iic.PNG" alt="RSET IIC" />
            <img className="w-40" src="/images/silver_jubilee_rset.png" alt="Silver Jubilee RSET" />
            <img className="w-40" src="/images/rset_iedc.PNG" alt="RSET IEDC" />
          </div>

          {/* ASCII Art
          <div className="hidden md:block font-mono text-xs text-muted-foreground/50 text-center whitespace-pre leading-none">
            {`   _____
  |     |
  | [_] |
  |_____|
  _|___|_
 |_______|`}
          </div> */}

          <div className="flex flex-col items-end gap-4">
            <div className="font-mono">Follow Us</div>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  // opens the socials in another tab
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            Made with {"</>"} by HackS'US Team
          </p>
          <div className="flex gap-6 font-mono text-xs text-muted-foreground">
            <p className="hover:text-primary transition-colors">Code of Conduct</p>
            <p className="hover:text-primary transition-colors">Privacy Policy</p>
            <p className="hover:text-primary transition-colors">Terms</p>
          </div>
        </div>

        {/* Easter egg hint
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-muted-foreground/30">
            {"// Try the Konami code... if you dare"}
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
